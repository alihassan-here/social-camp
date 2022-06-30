import React from 'react';
import { Avatar } from 'antd';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const CreatePostForm = ({ content, setContent, postSubmit, handleImage, uploading, image }) => {
    console.log(content);
    return (
        <div className="card">
            <div className="card-body pb-3">
                <form className="form-group">
                    <ReactQuill
                        theme='snow'
                        value={content}
                        onChange={e => setContent(e)}
                        className="form-control"
                        placeholder="Write something"
                        modules={
                            {
                                toolbar: {
                                    container: [
                                        [{ header: '1' }, { header: '2' }, { font: [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [
                                            { list: 'ordered' },
                                            { list: 'bullet' },
                                            { indent: '-1' },
                                            { indent: '+1' }
                                        ],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                    clipboard: {
                                        // toggle to add extra line breaks when pasting HTML:
                                        matchVisual: false
                                    }
                                }
                            }
                        }
                    />
                </form>
            </div>
            <div className="card-footer d-flex justify-content-between text-muted">
                <button
                    disabled={!content}
                    onClick={postSubmit} type="submit"
                    className="btn btn-sm btn-primary mt-1"
                >
                    Post
                </button>
                <label>
                    {
                        image && image.url ? (
                            <Avatar size={30} src={image.url} />
                        )
                            : uploading ?
                                (
                                    <LoadingOutlined className="mt-1"
                                    />
                                )
                                : (
                                    <CameraOutlined className="mt-1"
                                    />
                                )
                    }

                    <input
                        onChange={handleImage}
                        type="file"
                        accept='images/*'
                        hidden
                    />
                </label>
            </div>
        </div>
    )
}

export default CreatePostForm;