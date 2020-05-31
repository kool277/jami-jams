package net.jami.jams.common.serialization.fs;

import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;

@Getter
@Setter
public abstract class FileStorage<T> {

    private File file;
    private FileInputStream fileInputStream;
    private FileOutputStream fileOutputStream;
    private FileDescriptor fileDescriptor;

    public FileStorage(String file) {
        this.file = new File(file);
    }

    public abstract T getObject(byte[] bytes) throws Exception;
    public abstract byte[] getBytesFromObject(T object) throws Exception;

    public T getData() throws Exception{
        fileInputStream = new FileInputStream(file);
        return getObject(fileInputStream.readAllBytes());
    }

    public void storeData(T data) throws Exception{
        fileOutputStream = new FileOutputStream(file);
        fileDescriptor = fileOutputStream.getFD();
        fileOutputStream.write(getBytesFromObject(data));
        fileOutputStream.flush();
        fileDescriptor.sync();
    }



}
