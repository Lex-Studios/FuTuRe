import { describe, it, expect } from 'vitest';
import { createConfigFromEnv } from '../src/config/env.js';

describe('Environment Validation', () => {
  describe('Issue #439: Required secrets validation', () => {
    it('should throw error when STREAM_SECRET_ENCRYPTION_KEY is missing', () => {
      const env = {
        DATABASE_URL: 'postgresql://user:pass@localhost/db',
        PORT: '3001',
        STELLAR_NETWORK: 'testnet',
        JWT_SECRET: 'test-secret',
      };

      expect(() => createConfigFromEnv(env)).toThrow(
        /Missing required environment variables.*STREAM_SECRET_ENCRYPTION_KEY/
      );
    });

    it('should throw error when DATABASE_URL is missing', () => {
      const env = {
        STREAM_SECRET_ENCRYPTION_KEY: 'a'.repeat(64),
        PORT: '3001',
        STELLAR_NETWORK: 'testnet',
        JWT_SECRET: 'test-secret',
      };

      expect(() => createConfigFromEnv(env)).toThrow(
        /Missing required environment variables.*DATABASE_URL/
      );
    });

    it('should throw error when both secrets are missing', () => {
      const env = {
        PORT: '3001',
        STELLAR_NETWORK: 'testnet',
        JWT_SECRET: 'test-secret',
      };

      expect(() => createConfigFromEnv(env)).toThrow(
        /Missing required environment variables.*STREAM_SECRET_ENCRYPTION_KEY.*DATABASE_URL/
      );
    });

    it('should throw error when secrets are empty strings', () => {
      const env = {
        STREAM_SECRET_ENCRYPTION_KEY: '',
        DATABASE_URL: '',
        PORT: '3001',
        STELLAR_NETWORK: 'testnet',
        JWT_SECRET: 'test-secret',
      };

      expect(() => createConfigFromEnv(env)).toThrow(
        /Missing required environment variables/
      );
    });

    it('should succeed when all required secrets are present', () => {
      const env = {
        STREAM_SECRET_ENCRYPTION_KEY: 'a'.repeat(64),
        DATABASE_URL: 'postgresql://user:pass@localhost/db',
        PORT: '3001',
        STELLAR_NETWORK: 'testnet',
        JWT_SECRET: 'test-secret',
      };

      expect(() => createConfigFromEnv(env)).not.toThrow();
    });
  });
});
