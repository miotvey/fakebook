export namespace ExceptionUtils {
  export const detectMessage = (
    e: unknown,
    defaultMessage = 'Unknown exception.',
  ): string => {
    if (e instanceof Error) {
      return e.message;
    }

    return defaultMessage;
  };

  export const detectStack = (e: unknown): string => {
    if (e instanceof Error) {
      return e.stack || '';
    }

    return '';
  };
}
