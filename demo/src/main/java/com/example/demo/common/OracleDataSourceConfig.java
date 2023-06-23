package com.example.demo.common;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
//@MapperScan(value = "com.pmh.project.dao.oracle")
public class OracleDataSourceConfig {
	private final String DATA_SOURCE = "OracleDataSource";
	private final String SESSION_FACTORY = "OracleFactory";
	private final String SQL_SESSION = "OracleSqlSession";

	@Primary
	@Bean(DATA_SOURCE)
	@ConfigurationProperties(prefix = "spring.datasource")
	DataSource ADataSource() {
		return DataSourceBuilder.create()
				.type(HikariDataSource.class)
				.build();
	}

	@Primary
	@Bean(SESSION_FACTORY)
	SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
		bean.setDataSource(dataSource);
		
		Resource[] res = new PathMatchingResourcePatternResolver().getResources("classpath:mappers/*Mapper.xml");
		bean.setMapperLocations(res);
		
		return bean.getObject();
	}

    @Primary
    @Bean(SQL_SESSION)
    SqlSessionTemplate sqlSession(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}