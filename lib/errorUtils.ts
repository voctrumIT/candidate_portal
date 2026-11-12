/**
 * Converts raw server errors, API exceptions, and HTTP status codes into
 * clear, professional, user-friendly messages.
 * Never exposes raw HTTP status codes like 400, 401, 403, 404, 500, etc. to users.
 */
export function getUserFriendlyErrorMessage(
  err: any,
  context?: 'login' | 'register' | 'profile' | 'general'
): string {
  if (!err) {
    return 'An unexpected issue occurred. Please try again.';
  }

  // Extract status code if available
  const statusMatch =
    err?.status ||
    err?.statusCode ||
    err?.StatusCode ||
    (typeof err?.message === 'string' && err.message.match(/\b(400|401|403|404|409|422|429|500|502|503|504)\b/)?.[1]);
  const statusCode = statusMatch ? Number(statusMatch) : 0;

  // Extract raw message from any source (checking PascalCase and camelCase)
  let raw = '';
  if (typeof err === 'string') {
    raw = err;
  } else if (err?.rawMessage && typeof err.rawMessage === 'string') {
    raw = err.rawMessage;
  } else if (err?.data?.Message || err?.data?.message) {
    raw = err.data.Message || err.data.message;
  } else if (err?.message && typeof err.message === 'string') {
    raw = err.message;
  } else if (err?.error || err?.Error) {
    const e = err.error || err.Error;
    raw = typeof e === 'string' ? e : JSON.stringify(e);
  } else if (err?.title || err?.Title) {
    raw = err.title || err.Title;
  }

  // Strip technical prefixes and status code references
  let cleaned = raw
    .replace(/^api\s*error:\s*/i, '')
    .replace(/^error:\s*/i, '')
    .replace(/^\d{3}\s*:\s*/i, '')
    .replace(/\b(status\s*code|status)\s*[:=]?\s*\d{3}\b/gi, '')
    .replace(/\b(http\s*error|api\s*error)\s*\d{3}\b/gi, '')
    .replace(/\b\d{3}\s+(bad request|not found|unauthorized|forbidden|internal server error)\b/gi, '')
    .trim();

  const lower = cleaned.toLowerCase();

  // 1. Network / Connection errors
  if (lower.includes('failed to fetch') || lower.includes('network error') || lower.includes('connection refused')) {
    return 'Unable to connect to the service. Please check your internet connection and try again.';
  }

  // 2. Duplicate Account / Duplicate Email (Registration)
  if (
    lower.includes('already exists') ||
    lower.includes('already registered') ||
    lower.includes('already taken') ||
    lower.includes('duplicate') ||
    statusCode === 409 ||
    (context === 'register' && (lower.includes('exists') || lower.includes('already')))
  ) {
    return 'An account with this email address already exists. Please sign in instead.';
  }

  // 3. Login / Authentication failures (Non-existing email, incorrect credentials, forbidden/unauthorized)
  if (context === 'login') {
    if (
      statusCode === 401 ||
      statusCode === 403 ||
      statusCode === 404 ||
      lower.includes('not authorized') ||
      lower.includes('unauthorized') ||
      lower.includes('invalid credentials') ||
      lower.includes('invalid email') ||
      lower.includes('wrong password') ||
      lower.includes('user not found') ||
      lower.includes('candidate not found') ||
      lower.includes('not found') ||
      lower.includes('does not exist') ||
      lower.includes('no account')
    ) {
      if (
        statusCode === 404 ||
        lower.includes('not found') ||
        lower.includes('does not exist') ||
        lower.includes('no account')
      ) {
        return 'No account was found with this email address. Please check your spelling or register for a new account.';
      }
      return 'Incorrect email address or password, or no account exists with this email. Please verify your credentials or register.';
    }
  }

  // 4. General Unauthorized (401)
  if (
    statusCode === 401 ||
    lower.includes('unauthorized') ||
    lower.includes('session expired') ||
    lower.includes('authentication failed')
  ) {
    if (context === 'login') {
      return 'Incorrect email address or password. Please verify your credentials and try again.';
    }
    return 'Your session has ended. Please sign in again to continue.';
  }

  // 5. General Forbidden (403)
  if (statusCode === 403 || lower.includes('forbidden') || lower.includes('access denied')) {
    if (context === 'login') {
      return 'Incorrect email address or password, or no account exists with this email. Please check your credentials or register.';
    }
    return 'You do not have permission to perform this action.';
  }

  // 6. Not Found (404)
  if (
    statusCode === 404 ||
    lower.includes('not found') ||
    lower.includes('user not found') ||
    lower.includes('candidate not found')
  ) {
    if (context === 'login') {
      return 'No account was found with this email address. Please check your spelling or register for a new account.';
    }
    return 'The requested information could not be found. Please check your details and try again.';
  }

  // 7. Validation / Bad Request (400 / 422)
  if (statusCode === 400 || statusCode === 422 || lower.includes('bad request') || lower.includes('validation')) {
    // If the server provided a specific field message that is clean, readable, and informative
    if (
      cleaned &&
      cleaned.length > 5 &&
      !lower.startsWith('bad request') &&
      !lower.startsWith('api error') &&
      !lower.includes('one or more validation errors') &&
      !lower.includes('an error occurred')
    ) {
      return formatSentence(cleaned);
    }
    if (context === 'login') {
      return 'Please enter a valid email address and password.';
    }
    if (context === 'register') {
      return 'Please ensure all required fields are filled out accurately and your password meets security requirements.';
    }
    return 'Some of the information entered is incomplete or invalid. Please check your details and try again.';
  }

  // 8. Server errors (500+)
  if (
    statusCode >= 500 ||
    lower.includes('internal server error') ||
    lower.includes('service unavailable') ||
    lower.includes('gateway timeout')
  ) {
    return 'Our service is temporarily unavailable. Please try again in a few moments.';
  }

  // 9. If we have a clean, human-readable sentence from the server
  if (
    cleaned &&
    cleaned.length > 5 &&
    !/^(bad request|not found|unauthorized|server error|\d{3})$/i.test(cleaned) &&
    !lower.includes('an error occurred')
  ) {
    return formatSentence(cleaned);
  }

  // 10. Fallbacks by context
  if (context === 'login') {
    return 'Could not sign you in. Please check your credentials and try again.';
  }
  if (context === 'register') {
    return 'Could not complete registration. Please review the form and try again.';
  }

  return 'Something went wrong while processing your request. Please try again.';
}

function formatSentence(text: string): string {
  let trimmed = text.trim();
  trimmed = trimmed.replace(/\s*\(status:\s*\d+\)/gi, '');
  if (!trimmed) return 'An error occurred. Please try again.';
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return capitalized.endsWith('.') || capitalized.endsWith('!') ? capitalized : `${capitalized}.`;
}
