package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class DemoWebconfig implements WebMvcConfigurer {
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/js/**").addResourceLocations("classpath:/static/dist/js/");
		registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/dist/css/");
		registry.addResourceHandler("/font/**").addResourceLocations("classpath:/static/dist/font/");
		registry.addResourceHandler("/img/**").addResourceLocations("classpath:/static/dist/img/");
	}
}