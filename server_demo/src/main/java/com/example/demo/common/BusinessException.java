package com.example.demo.common;

/**
 * 业务异常，一般用于可预见的业务错误
 * @code
 * @message 错误信息
 */
public class BusinessException extends RuntimeException {
    private final int code;
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
    public int getCode() { return code; }
}
