import '../../assets/PostItem.css'
import '../../assets/View.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deletePost, changeVotePost, getPostById } from '../../actions/posts'
import CommentList from '../Comments/CommentList'
import ConfirmModal from '../Utils/ConfirmModal'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import PostModal from './PostModal'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'

class PostDetails extends Component {
    state = {
        showConfirmDeleteModal: false,
        showPostModal: false,
        modalComment: null,
    }

    componentDidMount () {
        this.props.getPostById(this.props.match.params.postId)
    }

    openPostModal = () => this.setState({ showPostModal: true })
    closePostModal = () => this.setState({ showPostModal: false })

    openConfirmDeleteModal = () => this.setState({ showConfirmDeleteModal: true })
    closeConfirmDeleteModal = () => this.setState({ showConfirmDeleteModal: false })

    goBack = () => this.props.history.push('/')

    delete = postId => this.props.deletePost(postId).then(this.goBack)
    
    changeVote = option => this.props.changeVotePost(this.props.match.params.postId, option)

    render() {
        const { post } = this.props
        const { showPostModal, showConfirmDeleteModal } = this.state

        return (
            <div className="view-container">
                <header className="view-header">
                    <h2>Post Details</h2>
                </header>
                {post && 
                    <div className="post-item details">
                        <div className="category"><span>{post.category.toUpperCase()}</span></div>
                        <header className="post-item-header">
                            <div className="title">
                                <h4>{post.title}</h4>
                                <div>
                                    <IconButton className="icon-button" 
                                                tooltip="Delete"
                                                onClick={this.openPostModal}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                    <IconButton className="icon-button" 
                                                tooltip="Delete"
                                                onClick={this.openConfirmDeleteModal}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                </div>
                                
                            </div>
                            <div className="author">
                                <span>
                                    By <span className="author-name">{post.author}</span> 
                                    ({new Date(post.timestamp).toLocaleString()})
                                </span>
                            </div>              
                        </header>
                        <div className="post-item-body">{post.body}</div>
                        <footer className="post-item-footer">
                            <div className="votes">
                                <span>Vote Score: {post.voteScore}</span>
                                <Tooltip title="Upvote">
                                    <IconButton className="icon-button"
                                                onClick={() => this.changeVote("upVote")}>
                                        <Icon>thumb_up</Icon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Downvote">
                                    <IconButton className="icon-button"
                                                onClick={() => this.changeVote("downVote")}>
                                        <Icon>thumb_down</Icon>
                                    </IconButton>
                                </Tooltip>
                            </div>                            
                        </footer>

                        <CommentList postId={post.id} />

                        <Dialog open={showPostModal}>
                            <DialogTitle>Edit Post</DialogTitle>
                            <PostModal post={post} closeModal={this.closePostModal} />
                        </Dialog>

                        <ConfirmModal 
                            open={showConfirmDeleteModal} 
                            onConfirm={() => this.delete(post.id)} 
                            onCancel={this.closeConfirmDeleteModal} 
                            itemType="post" />
                    </div>
                }
            </div>                      
        )
    }
}

const mapStateToProps = ({ posts }, ownProps) => {
    return { post: posts.find(p => p.id === ownProps.match.params.postId) }
}

const mapDispatchToProps = dispatch => ({
    getPostById: postId => dispatch(getPostById(postId)),
    deletePost: postId => dispatch(deletePost(postId)),
    changeVotePost: (post, option) => dispatch(changeVotePost(post, option)),
})

PostDetails.propTypes = {
    getPostById: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    changeVotePost: PropTypes.func.isRequired,
    post: PropTypes.object,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostDetails)