import React from 'react'
import AddButton from '../../../component/AddButton'
import { useParams } from 'react-router-dom';

const CreateSEOSetting = () => {
       const { id } = useParams();
    const isEdit = Boolean(id);
  return (
    <div>
        <div>
            <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">SEO Setting Basic Info</h2>
                    <AddButton
                        label={isEdit ? "Update SEO Setting" : "Create SEO Setting"}
                        type="button"

                        onClick={() => {
                            console.log("pop")
                        }}
                    />
                </div>






            </div>
        </div>
    </div>
  )
}

export default CreateSEOSetting