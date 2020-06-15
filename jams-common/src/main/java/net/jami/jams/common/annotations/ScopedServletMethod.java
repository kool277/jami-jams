package net.jami.jams.common.annotations;

import net.jami.jams.common.objects.user.AccessLevel;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface ScopedServletMethod {
    public AccessLevel[] securityGroups();
}
