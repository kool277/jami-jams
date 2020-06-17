package net.jami.jams.common.annotations;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.bytecode.AnnotationsAttribute;
import javassist.bytecode.MethodInfo;
import javassist.bytecode.annotation.Annotation;
import javassist.bytecode.annotation.ArrayMemberValue;
import javassist.bytecode.annotation.EnumMemberValue;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.AccessLevel;

import java.util.HashSet;

@Slf4j
@Deprecated(since = "2.0", forRemoval = true)
public class ScopedServletAnnotationScanner {

    public void scanAndModify(HashSet<String> classes){
        classes.parallelStream().forEach(this::processClass);
    }

    public void processClass(String classname){
        try {
            CtClass cc = ClassPool.getDefault().get(classname);
            cc.defrost();
            CtMethod[] ctMethods = cc.getMethods();
            boolean classChanged = false;
            for (int i = 0; i < ctMethods.length; i++) {
                MethodInfo minfo = ctMethods[i].getMethodInfo();
                if(minfo.getAttribute(AnnotationsAttribute.visibleTag) == null){
                    continue;
                }
                AnnotationsAttribute attr = (AnnotationsAttribute) minfo.getAttribute(AnnotationsAttribute.visibleTag);
                Annotation[] an = attr.getAnnotations();
                for(int j=0; j<an.length; j++) {
                    if(an[j].getTypeName().equals(ScopedServletMethod.class.getName())) {
                        ArrayMemberValue memberValue = (ArrayMemberValue) an[j].getMemberValue("securityGroups");
                        HashSet<AccessLevel> accessLevels = new HashSet<>();
                        for(int k =0; k<memberValue.getValue().length; k++){
                            EnumMemberValue level = (EnumMemberValue) memberValue.getValue()[k];
                            AccessLevel accessLevel = AccessLevel.valueOf(level.getValue());
                            classChanged = true;
                            accessLevels.add(accessLevel);
                        }
                        log.info("[{}] has secured method {}, modifying method... ",cc.getSimpleName(), ctMethods[i].getName());
                        //Build the code block that enforces security.
                        StringBuilder sb = new StringBuilder();
                        sb.append("{\n");
                        //So this does not play nice when trying to use hash sets...
                        sb.append("boolean allowed = false;\n");
                        sb.append("net.jami.jams.common.objects.user.AccessLevel level = (net.jami.jams.common.objects.user.AccessLevel) req.getAttribute(\"accessLevel\");\n");
                        accessLevels.forEach(e -> {
                            sb.append("if(level == net.jami.jams.common.objects.user.AccessLevel.valueOf(\"").append(e.toString()).append("\")) allowed = true;\n");
                        });
                        sb.append("if(!allowed){\n");
                        sb.append("resp.sendError(403,\"No valid access level found!\");\n");
                        sb.append("return;\n");
                        sb.append("}\n");
                        sb.append("}\n");
                        ctMethods[i].insertBefore(sb.toString());
                    }
                }
            }
            if(classChanged){
                try {
                    if (cc.isFrozen()) cc.defrost();
                    cc.toClass();
                    log.info("Successfully modified class " + classname);
                }
                catch (Exception e){
                    log.error("Could not persist changes to class " + classname);
                }
            }
        } catch (Exception e) {
            //log.info("Could not modify a target class with error {}",e.getMessage());
        }
    }
}
