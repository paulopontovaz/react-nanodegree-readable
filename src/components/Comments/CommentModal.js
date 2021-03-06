import '../../assets/Modal.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addComment, updateComment } from '../../actions/comments'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

//Componente com funcionalidade similar à do componente PostModal.
class CommentModal extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      author: '', 
      body: '', 
      parentId: this.props.postId
    }

    if(this.props.comment && this.props.comment.author && this.props.comment.body)
      this.state = {...this.props.comment}
  }

  save (comment) {
    if (comment.author && comment.body) {
      let promise

      if (comment.id)
        promise = this.props.updateComment(comment)
      else
        promise = this.props.addComment(comment)

      promise.then(this.props.closeModal)
    }
  }

  render() {
    const { closeModal } = this.props
    const { author, body, id } = this.state

    return (
      <div className="modal-container">
        <DialogContent>
          <TextField 
            fullWidth={true}
            label="Author"
            value={author} 
            onChange={event => this.setState({author: event.target.value})}
            required />
          <TextField 
            fullWidth={true}
            label="Text"
            multiline
            rows={3}
            value={body} 
            onChange={event => this.setState({body: event.target.value})}
            required />
        </DialogContent>
        <DialogActions>
          <Button 
            variant="flat"
            onClick={closeModal}>CANCEL</Button>
          <Button 
            variant="flat"
            onClick={() => this.save(this.state)} 
            color="primary">{id ? "UPDATE" : "CREATE"}</Button>
        </DialogActions>
      </div>
    )    
  }
}

const mapDispatchToProps = dispatch => ({
    addComment: comment => dispatch(addComment(comment)),
    updateComment: comment => dispatch(updateComment(comment)),
})

//Certificando que as devidas propriedades estejam presentes e no formato certo
CommentModal.propTypes = {
    addComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    comment: PropTypes.object,
}

//Enviando os mapeamentos para propriedades, com o "connect"
export default connect(
    null,
    mapDispatchToProps
)(CommentModal)