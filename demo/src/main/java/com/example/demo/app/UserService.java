package com.example.demo.app;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.common.OracleDao;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class UserService {
	@Autowired
	private OracleDao oracleDao;

	public List<Map<String, Object>> selectMenuList(Map<String, Object> paramMap) {
		return oracleDao.selectList("com.example.demo.app.selectMenuList", paramMap);
	}

	public List<Map<String, Object>> selectGridDataList(Map<String, Object> paramMap) {
		return oracleDao.selectList("com.example.demo.app.selectGridDataList", paramMap);
	}

	@Transactional
	public int save(Map<String, Object> paramMap){
		//log.info(paramMap.toString());
		List<Map<String,Object>> insert = (List<Map<String, Object>>) paramMap.get("insert");
		List<Map<String,Object>> update = (List<Map<String, Object>>) paramMap.get("update");
		List<Map<String,Object>> delete = (List<Map<String, Object>>) paramMap.get("delete");
		
		int count = 0;
		for(Map<String, Object> m : insert){
			count += insertGridData(m);
		}
		for(Map<String, Object> m : update){
			count += updateGridData(m);
		}
		for(Map<String, Object> m : delete){
			count += deleteGridData(m);
		}

		return  count;
	}
	public int insertGridData(Map<String,Object> m){
		return oracleDao.insert("insertGridData", m);
	}
	public int updateGridData(Map<String,Object> m){
		return oracleDao.update("updateGridData", m);
	}
	public int deleteGridData(Map<String,Object> m){
		return oracleDao.delete("deleteGridData", m);
	}
}