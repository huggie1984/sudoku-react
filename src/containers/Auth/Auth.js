import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Input from '../../components/UI/Input/Input';
import AppButton from '../../components/UI/Button/Button';


// TODO refactor this shit and tidy it up and sort out the disabled button.
// TODO is form valid? display signin button.
class Auth extends Component {

    state = {
      loginForm: {
          email: {
              label: 'Email address',
              id: 'emailControl',
              elementType: 'input',
              elementConfig: {
                  type: 'email',
                  placeholder: 'email address'
              },
              value: '',
              validation: {
                  required: true,
                  isEmail: true
              },
              valid: false,
              touched: false
          },
          password: {
              label: 'Password',
              id: 'passwordControl',
              elementType: 'input',
              elementConfig: {
                  type: 'password',
                  placeholder: 'password'
              },
              value: '',
              validation: {
                  required: true,
                  minLength: 6
              },
              valid: false,
              touched: false
          },
      },
      signUpForm: {
          email: {
              label: 'Email address',
              id: 'emailControl',
              elementType: 'input',
              elementConfig: {
                  type: 'email',
                  placeholder: 'email address'
              },
              value: '',
              validation: {
                  required: true,
                  isEmail: true
              },
              valid: false,
              touched: false
          },
          password: {
              label: 'Password',
              id: 'passwordControl',
              elementType: 'input',
              elementConfig: {
                  type: 'password',
                  placeholder: 'password'
              },
              value: '',
              validation: {
                  required: true,
                  minLength: 6
              },
              valid: false,
              touched: false
          },
          userName: {
              label: 'User name',
              id: 'UserNameControl',
              elementType: 'input',
              elementConfig: {
                  type: 'text',
                  placeholder: 'User name'
              },
              value: '',
              validation: {
                  required: true,
                  minLength: 5
              },
              valid: false,
              touched: false
          },
      },
        disabled: true,
        isLogin: true
    };

    submitHandler = (event) => {
        event.preventDefault();
        if(this.state.isLogin) {
            this.props.onAuth(this.state.loginForm.email.value, this.state.loginForm.password.value, null, this.state.isLogin)
        } else {
            this.props.onAuth(this.state.signUpForm.email.value, this.state.signUpForm.password.value, this.state.signUpForm.userName.value, this.state.isLogin)
        }
    };

    inputChangedHandler = (event, formKey, controlName) => {
      const updatedControls = {
        ...this.state[formKey],
        [controlName]: {
          ...this.state[formKey][controlName],
          value: event.target.value,
          valid: !this.checkValidity(event.target.value, this.state[formKey][controlName].validation),
          touched: true
        }
      };
      this.setState({[formKey]: updatedControls});
    };

    authSwitchHandler = () => {
      this.setState(prevState => {
        return {isLogin: !prevState.isLogin}
      })
    };

    checkValidity = (value, rules) => {
      let isValid = true;
      if(rules.required) {
          isValid = (value.trim() !== '') && isValid;
      }
      if(rules.minLength) {
          isValid = (value.length >= rules.minLength) && isValid;
      }
      if(rules.maxLength) {
          isValid = (value.length <= rules.maxLength) && isValid;
      }
      if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }
      return isValid
    };

    authForm = (controls, formKey) => (
        <Form onSubmit={(event) => this.submitHandler(event)}>
            {controls.map(control => (
                <Input label={control.config.label}
                       key={control.id}
                       elementType={control.config.elementType}
                       elementConfig={control.config.elementConfig}
                       value={control.config.value}
                       invalid={control.config.valid}
                       shouldValidate={control.config.validation}
                       touched={control.config.touched}
                       changed={(event) => this.inputChangedHandler(event, formKey, control.id)}/>
            ))}
            <div className="d-flex justify-content-end">
                <AppButton
                    disabled={false}
                    variant={'success'}
                    type={'submit'}
                    loading={this.props.loading}
                    label={this.state.isLogin ? 'Login' : 'Sign up'} />
            </div>
        </Form>
    );

    loginForm = () => {
        const formControls = [];
        for (let key in this.state.loginForm) {
            formControls.push({
                id: key,
                config: this.state.loginForm[key]
            })
        }
        return this.authForm(formControls,'loginForm');
    };

    signUpForm = () => {
        const formControls = [];
        for (let key in this.state.signUpForm) {
            formControls.push({
                id: key,
                config: this.state.signUpForm[key]
            })
        }
        return this.authForm(formControls, 'signUpForm');
    };

    render() {

      const form = this.state.isLogin ? this.loginForm() : this.signUpForm();

      let authRedirect = null;
      if (this.props.isAuth) {
        authRedirect = <Redirect to="/home"/>
      }

        return (
          <div className={classes.container + ' p-3'}>
            { authRedirect }
            <span className={classes.switchMode} onClick={() => this.authSwitchHandler()}>{this.state.isLogin ? 'Or sign up' : 'Or login'}</span>
            <h1>{this.state.isLogin? 'Login' : 'Sign up'}</h1> 
            { form }
          </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, userName, isLogin) => dispatch(actions.auth(email, password, userName, isLogin))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
