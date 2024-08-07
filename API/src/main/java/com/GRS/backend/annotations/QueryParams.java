package com.GRS.backend.annotations;

import java.lang.annotation.*;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface QueryParams {
    String search() default "";
    int page() default 0;
    int pageSize() default 10;
    String sortBy() default "id";
    String sortOrder() default "asc";
}
