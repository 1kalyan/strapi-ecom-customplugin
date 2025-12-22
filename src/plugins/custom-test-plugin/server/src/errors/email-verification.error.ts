import { errors } from '@strapi/utils';

const { ValidationError } = errors;

const TRUSTED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'live.com',
];

export function validateEmailProvider(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required', {
      field: 'email',
      reason: 'Email is missing or invalid',
    });
  }

  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    throw new ValidationError('Invalid email format', {
      field: 'email',
      reason: 'Email domain not found',
    });
  }

  if (!TRUSTED_EMAIL_DOMAINS.includes(domain)) {
    throw new ValidationError('Unsupported email provider', {
      field: 'email',
      reason: `Provider "${domain}" is not allowed`,
      allowedProviders: TRUSTED_EMAIL_DOMAINS,
    });
  }
}
