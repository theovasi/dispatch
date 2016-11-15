import React from 'react'
import R from 'ramda'
import { MdClose } from 'react-icons/lib/md'

import TextInput from './TextInput.jsx'

export default class MultiSelectInput extends React.Component {

  constructor(props) {
    super(props)

    this.removeValue = this.removeValue.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)

    this.renderSelected = this.renderSelected.bind(this)
    this.renderResult = this.renderResult.bind(this)
    this.isNotSelected = this.isNotSelected.bind(this)

    this.mouseIsDownOnField = false;

    this.state = {
      isActive: false,
      query: ''
    }
  }

  componentDidMount() {
    this.pageListener = window.addEventListener('mousedown', this.pageClick, false)
    this.fetchResults()
  }

  componentWillUnmount() {
    delete this.pageListener;
  }

  pageClick(e) {
    if (this.mouseIsDownOnField) {
      this.setState({ isActive: true })
    } else {
      this.setState({ isActive: false })
    }
  }

  handleMouseDown() {
    this.mouseIsDownOnField = true
  }

  handleMouseUp() {
    this.mouseIsDownOnField = false
  }

  handleInputChange(e) {
    e.preventDefault();
    this.setState(
      {
        query: e.target.value,
        isActive: true
      },
      this.fetchResults
    )
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.createValue(this.state.query.trim())
    }
  }

  fetchResults() {
    this.props.fetchResults(this.state.query)
  }

  removeValue(id) {
    this.props.removeValue(id)
  }

  addValue(id) {
    this.props.addValue(id)
    this.closeDropdown()
  }

  createValue(value) {
    // Get entities in search results
    const results = R.map(
      id => this.props.entities[id],
      this.props.results
    )

    // Get currently selected entities
    const selected = R.map(
      id => this.props.entities[id],
      this.props.selected
    )

    // Determine if the value has already been created
    let resultIndex = R.findIndex(
      R.propEq(this.props.attribute, value),
      results
    )

    let isResult = resultIndex !== -1

    // Determine if value has already been added to selection
    let isSelected = R.findIndex(
      R.propEq(this.props.attribute, value),
      selected
    ) !== -1

    if (isResult && !isSelected) {
      // If value is in results and not selected, add to selection
      this.props.addValue(results[resultIndex].id)
      this.closeDropdown()
    } else if (!isResult && !isSelected) {
      // If value is not in results or selected, create and add to selection
      this.props.createValue(value)
      this.closeDropdown()
    }

  }

  closeDropdown() {
    this.setState({
      isActive: false,
      query: ''
    })
  }

  renderSelected(id) {
    const value = this.props.entities[id]
    return (
      <li
        className='c-input--multi-select__value'
        key={value.id}>
        {value[this.props.attribute]}
          <div
            className='c-input--multi-select__value__icon'
            onClick={() => this.removeValue(value.id)}>
            <MdClose size={18} />
          </div>
        </li>
    )
  }

  isNotSelected(id) {
    return !R.contains(id, this.props.selected)
  }

  renderResult(id) {
    const value = this.props.entities[id]
    return (
      <li
        key={value.id}
        className='c-input--multi-select__result'
        onClick={() => this.addValue(value.id)}>{value[this.props.attribute]}</li>
    )
  }

  renderNoResults() {
    return (
      <div className='c-input--multi-select__no-results'>
        {`Press enter to create "${this.state.query.trim()}"`}
      </div>
    )
  }

  render() {
    const selected = R.map(this.renderSelected, this.props.selected)
    const results = R.map(this.renderResult, R.filter(this.isNotSelected, this.props.results))

    const dropdownBaseClassName = 'c-input--multi-select__dropdown'
    const dropdownClassName = dropdownBaseClassName + (this.state.isActive ? ` ${dropdownBaseClassName}--active` : '')

    return (
      <div
        className='c-input c-input--multi-select'>
        <ul className='c-input--multi-select__values'>
          {selected}
        </ul>
        <div
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}>
          <div className={dropdownClassName}>
            <TextInput
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.query}
              placeholder='Add new' />
            <ul className='c-input--multi-select__results'>
              {results.length ? results : this.renderNoResults()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}