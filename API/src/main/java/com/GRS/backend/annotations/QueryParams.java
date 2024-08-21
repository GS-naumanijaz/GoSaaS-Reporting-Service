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
    String sortBy() default "updatedAt";
    String sortOrder() default "desc";
    String startDate() default "0000-01-01";  // Beginning of time (LocalDate.MIN) yyyy-mm-dd
    String endDate() default "";
}
