package com.sneha.seatmgmtapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.support.TaskExecutorAdapter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
@EnableAsync
public class AsyncConfig {

	/**
	 * Application-wide async executor using Virtual Threads.
	 */
	@Bean
	@Primary
	public AsyncTaskExecutor applicationTaskExecutor() {
		ExecutorService virtual = Executors.newVirtualThreadPerTaskExecutor();
		return new TaskExecutorAdapter(virtual);
	}

	/**
	 * Dedicated ThreadPoolTaskExecutor to be used for WebSocket channels and other places
	 * that require a ThreadPoolTaskExecutor specifically.
	 *
	 * Tuned conservatively; adjust sizes per your load and environment.
	 */
	@Bean(name = "websocketTaskExecutor")
	public ThreadPoolTaskExecutor websocketTaskExecutor() {
		ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
		exec.setCorePoolSize(10);
		exec.setMaxPoolSize(200);
		exec.setQueueCapacity(1000);
		exec.setThreadNamePrefix("ws-");
		exec.initialize();
		return exec;
	}

	/**
	 * Task scheduler for STOMP heartbeats used by WebSocketConfig.
w	 * Uses explicit bean name for @Qualifier injection in WebSocketConfig.
	 */
	@Bean(name = "websocketTaskScheduler")
	public ThreadPoolTaskScheduler websocketTaskScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(1);
		scheduler.setThreadNamePrefix("ws-heartbeat-");
		scheduler.initialize();
		return scheduler;
	}
}
