package com.GRS.backend.utilities;
import java.lang.reflect.Field;

public class FieldUpdater {
    public static <T> void updateField(T target, String fieldName, T source) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(source);
            if (value != null) {
                field.set(target, value);
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }
}

