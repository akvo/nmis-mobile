import * as Yup from 'yup';

export const AuthSchema = Yup.object().shape({
  passcode: Yup.string().min(6, 'Too Short!').max(50, 'Too Long!').required('Required'),
  accept: Yup.boolean().required('Required'),
});
