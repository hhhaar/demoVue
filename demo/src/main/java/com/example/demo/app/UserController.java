/**
 * 
 */
package com.example.demo.app;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Administrator
 *
 */
@Slf4j
@RestController
@RequestMapping("/v1")
public class UserController {
	@Autowired private UserService userService;

	@GetMapping("/selectMenuList")
	public List<Map<String,Object>> selectMenuList(@RequestParam Map<String,Object> paramMap) {
		//log.info("## Entrance UserController.selectMenuList!");
		return userService.selectMenuList(paramMap);
	}

	@GetMapping("/selectGridList")
	public List<Map<String,Object>> selectGridList(@RequestParam Map<String,Object> paramMap) {
		//log.info("## Entrance UserController.selectGridList!");
		//log.info(paramMap.toString());
		return userService.selectGridDataList(paramMap);
	}

	@PostMapping("/save")
	public int save(@RequestBody Map<String, Object> paramMap){
		//log.info("## Entrance UserController.save!");
		return userService.save(paramMap);
	}

}
