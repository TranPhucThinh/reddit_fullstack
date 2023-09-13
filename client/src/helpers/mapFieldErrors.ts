import { FieldError } from '@/generated/graphql'

export const mapFieldErrors = (errors: FieldError[]) => {
  return errors.reduce((accErrors, currError) => ({
    ...accErrors,
    [currError.field]: currError.message,
  }), {});
};
