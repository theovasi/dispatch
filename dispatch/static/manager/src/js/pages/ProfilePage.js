import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Button, Intent } from '@blueprintjs/core'

import userActions from '../actions/UserActions'
import PersonEditor from '../components/PersonEditor'
import { TextInput } from '../components/inputs'

import * as Form from '../components/Form'

require('../../styles/components/user_form.scss')

class ProfilePageComponent extends React.Component {
  loadUser() {
    this.props.getUser(this.props.token, 'me')
  }

  componentDidMount() {
    this.loadUser()
  }

  getUserId() {
    return this.props.user.id
  }

  getPersonId() {
    const userId = this.getUserId()
    return userId ? this.props.entities.remote[userId].person : null
  }

  getUser() {
    const userId = this.getUserId()
    return userId ? (this.props.entities.local ? this.props.entities.local[userId]
      : this.props.entities.remote[userId]) : null
  }

  handleUpdate(field, value) {
    this.props.setUser(R.assoc(field, value, this.getUser()))
  }

  save() {
    this.props.saveUser(this.props.token, this.getUserId(), this.getUser())
  }

  render() {
    const userId = this.getUserId()
    const personId = this.getPersonId()
    const user = this.getUser()
    const errors = this.props.user.errors

    const personEditor = personId ? (
      <PersonEditor
        itemId={personId}
        goBack={this.props.router.goBack}
        route={this.props.route} />
    ) : null

    const userForm = userId ? (
      <div className='u-container u-container--padded c-user-form'>
        <div className='c-user-form__heading'>Account Details</div>
        <Form.Container onSubmit={e => e.preventDefault()}>
          <Form.Input
            label='Email'
            padded={false}
            error={errors.email}>
            <TextInput
              placeholder='name@domain.tld'
              value={user.email || ''}
              fill={true}
              onChange={e => this.handleUpdate('email', e.target.value)} />
          </Form.Input>
          <Form.Input
            label='Password'
            padded={false}
            error={errors.password_a}>
            <TextInput
              placeholder=''
              value={user.password_a || ''}
              fill={true}
              type='password'
              onChange={e => this.handleUpdate('password_a', e.target.value)} />
          </Form.Input>
          <Form.Input
            label='Password Again'
            padded={false}
            error={errors.password_b}>
            <TextInput
              placeholder=''
              value={user.password_b || ''}
              fill={true}
              type='password'
              onChange={e => this.handleUpdate('password_b', e.target.value)} />
          </Form.Input>
        </Form.Container>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.save()}>
          Save
        </Button>
      </div>
    ) : null

    return (
      <div>
        {personEditor}
        {userForm}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.app.users.single,
    entities: {
      remote: state.app.entities.users,
      local: state.app.entities.local.users
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (token, eventId) => {
      dispatch(userActions.get(token, eventId))
    },
    saveUser: (token, eventId, data) => {
      dispatch(userActions.save(token, eventId, data))
    },
    setUser: (data) => {
      dispatch(userActions.set(data))
    }
  }
}

const ProfilePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePageComponent)

export default ProfilePage
