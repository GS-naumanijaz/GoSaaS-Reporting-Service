package com.GRS.backend.annotations;

import java.lang.annotation.*;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface QueryParams {
    String search() default "";
    String searchBy() default "id";
    int page() default 0;
    int pageSize() default 10;
    String sortBy() default "updatedAt";  // set to updated_at
    String sortOrder() default "desc";  // set to desc
}
