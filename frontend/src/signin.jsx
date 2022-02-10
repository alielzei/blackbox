import { Container, TextField, Typography, Box, Button } from '@mui/material'

import { Link } from 'react-router-dom'

import * as Yup from 'yup';
import { Formik } from 'formik';

import AppContext from './appcontext';
import { useContext } from 'react';

const axios = require('axios')

export default function Signin() {
    const { getUser } = useContext(AppContext);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string().max(255).required('Username is required'),
                            password: Yup.string().max(255).required('Password is required')
                        })}
                        onSubmit={async (values) => {
                            try {
                                await axios.post('api/user/signin', values, { withCredentials: true })
                            } catch (error) {
                                console.log(error.response.data)
                            }
                            
                            getUser()
                        }}
                    >
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            touched,
                            values
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        color="textPrimary"
                                        variant="h2"
                                    >
                                        Sign in
                                    </Typography>
                                </Box>
                                <TextField
                                    error={Boolean(touched.username && errors.username)}
                                    fullWidth
                                    helperText={touched.username && errors.username}
                                    label="Username"
                                    margin="normal"
                                    name="username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text" // ?
                                    value={values.username}
                                    variant="outlined"
                                />
                                <TextField
                                    error={Boolean(touched.password && errors.password)}
                                    fullWidth
                                    helperText={touched.password && errors.password}
                                    label="Password"
                                    margin="normal"
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="password"
                                    value={values.password}
                                    variant="outlined"
                                />
                                <Box sx={{ py: 2 }}>
                                    <Button
                                        color="primary"
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        Sign in now
                                    </Button>
                                </Box>
                                <Typography
                                    color="textSecondary"
                                    variant="body1"
                                >
                                    Don&apos;t have an account?
                                    {' '}
                                    <Link
                                        component={Link}
                                        to="/register"
                                        variant="h6"
                                    >
                                        Sign up
                                    </Link>
                                </Typography>
                            </form>
                        )}
                    </Formik>
                </Container>
            </Box>
        </>
    );
}