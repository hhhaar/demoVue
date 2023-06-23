package com.example.demo.common;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

@Repository("oracleDao")
public class OracleDao {
	
	@Autowired
	@Qualifier("OracleSqlSession")
	private SqlSessionTemplate sqlSession;
	
	public int selectListCnt(String queryId, Object parameterObject){
		return sqlSession.selectOne(queryId, parameterObject);
	}
	
	public <E> List<E> selectList(String queryId, Object parameterObject){
		return sqlSession.selectList(queryId, parameterObject);
	}
	
	public <T> T select(String queryId, int parameterInt){
		return sqlSession.selectOne(queryId, parameterInt);
	}
	
	public <T> T select(String queryId, Object parameterObject){
		return sqlSession.selectOne(queryId, parameterObject);
	}
	
	public int insert(String queryId, Object parameterObject){
		return sqlSession.insert(queryId, parameterObject);
	}
	
	public int update(String queryId, Object parameterObject){
		return sqlSession.update(queryId, parameterObject);
	}
	
	public int delete(String queryId, Object parameterObject){
		return sqlSession.delete(queryId, parameterObject);
	}
	
}