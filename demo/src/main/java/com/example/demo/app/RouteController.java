/**
 * 
 */
package com.example.demo.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Administrator
 *
 */
@Slf4j
@Controller
public class RouteController {
	@GetMapping("/")
	public String index() {
		//log.info("## Entrance RouteController.index!");
		return "index";
	}
}
