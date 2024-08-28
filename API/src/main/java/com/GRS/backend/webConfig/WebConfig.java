package com.GRS.backend.webConfig;

import com.GRS.backend.annotations.QueryParamsConfig;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.resolver.RequestInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RequestInterceptor requestInterceptor;

    private final QueryParamsConfig queryParamsConfig;

    public WebConfig(QueryParamsConfig queryParamsConfig) {
        this.queryParamsConfig = queryParamsConfig;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(queryArgumentResolver());
    }

    @Bean
    public QueryArgumentResolver queryArgumentResolver() {
        return new QueryArgumentResolver(queryParamsConfig);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestInterceptor);
    }
}
