import React from 'react'
import AddButton from '../../../component/AddButton'
import { useNavigate, useParams } from 'react-router-dom';

const CreateEmailMarketing = () => {
        const navigate = useNavigate();
    
    const { id } = useParams();
    const isEdit = Boolean(id);
    return (
        <div><div>
            <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Email Marketing Basic Info</h2>
                    <AddButton
                        label={isEdit ? "Update Email Marketing" : "Create Email Marketing"}
                        type="button"
                        onClick={() => navigate("/CreateEmailMarketing")}
                    />
                </div>






            </div>
        </div></div>
    )
}

export default CreateEmailMarketing