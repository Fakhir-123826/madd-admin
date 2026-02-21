import React, { useState } from 'react'
import AddButton from '../../../component/AddButton'
import { useParams } from 'react-router-dom'
import Input from '../../../component/Inputs Feilds/Input'

const CreateSEOSetting = () => {
    const [showGenerating, setShowGenerating] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const handleCreateSitemap = () => {
        setShowGenerating(true)

        setTimeout(() => {
            setShowGenerating(false)
            setShowSuccess(true)
        }, 3000) // 👉 change to 180000 for 3 min
    }


    const { id } = useParams()
    const isEdit = Boolean(id)

    const [formData, setFormData] = useState({
        meta_title: '',
        meta_description: '',
        keywords: ['Features', 'Features', 'Features']
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('SEO Data 👉', formData)
    }

    const handleCancel = () => {
        setFormData({
            meta_title: '',
            meta_description: '',
            keywords: []
        })
    }

    return (
        <div className="bg-white shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">SEO Setting Basic Info</h2>
                <AddButton
                    label={isEdit ? "Update SEO Setting" : "Create SEO Setting"}
                    type="button"
                    onClick={() => console.log("submit")}
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
            >

                {/* SECTION TITLE */}
                <h2 className="text-lg font-semibold text-gray-800">SEO Info</h2>

                {/* META TITLE */}
                <Input
                    label="Meta Title"
                    name="meta_title"
                    placeholder="Title Here"
                    value={formData.meta_title}
                    onChange={handleChange}
                />
                <p className="text-xs text-gray-400 -mt-4">Max 60 characters</p>

                {/* META DESCRIPTION */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Meta Description
                    </label>
                    <textarea
                        name="meta_description"
                        placeholder="Description"
                        rows={4}
                        value={formData.meta_description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl p-3"
                    />
                    <p className="text-xs text-gray-400 mt-1">Max 160 characters</p>
                </div>

                {/* KEYWORDS */}
                {/* KEYWORDS + SITEMAP WRAPPER */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-6">

                    {/* KEYWORDS */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-700">Keywords</p>

                            <button
                                type="button"
                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                            >
                                Add Keyword
                            </button>
                        </div>

                        {/* Tags container */}
                        <div className="flex flex-wrap gap-2 bg-white border border-gray-200 rounded-lg p-2">
                            {formData.keywords.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SITEMAP */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Sitemap Generation
                        </p>

                        <p className="text-xs text-gray-500">
                            Last Generated Date
                        </p>

                        <p className="text-sm text-gray-700 mb-3">
                            23 July 2025
                        </p>

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={handleCreateSitemap}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg"
                            >
                                Create Sitemap
                            </button>

                            <button
                                type="button"
                                className="w-full bg-gray-200 text-gray-700 text-sm py-2 rounded-lg"
                            >
                                Download Sitemap
                            </button>
                        </div>
                    </div>

                </div>


                {/* SEO SCORE */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-4">
                        SEO Score
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                        {/* LEFT PREVIEW CARD */}
                        <div className="border rounded-xl p-4 bg-white shadow-sm">

                            <div className="text-[11px] text-gray-400 mb-2">
                                About 115,000,000 results (0.35 seconds)
                            </div>

                            <div className="text-sm font-semibold text-blue-700 mb-1">
                                Then it get from the basic SEO tips
                            </div>

                            <div className="text-xs text-gray-600 mb-2">
                                www.example.com
                            </div>

                            <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1">
                                <li>Write longer posts.</li>
                                <li>Use keyword front.</li>
                                <li>Place keywords smart.</li>
                                <li>Optimize your links, meta description, and headings.</li>
                                <li>Answer questions.</li>
                                <li>Aim for backlinks.</li>
                                <li>Link to others.</li>
                                <li>Make your site fast.</li>
                            </ul>

                            <div className="text-xs text-blue-600 mt-3">
                                Basic SEO: Top 17 Tips That Every Beginner Should Know →
                            </div>

                        </div>

                        {/* RIGHT CHECKLIST CARD */}
                        <div className="border rounded-2xl p-5 bg-gray-50">

                            <ul className="space-y-4 text-sm">

                                <li className="flex items-center gap-2 text-gray-700">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    Title length okay
                                </li>

                                <li className="flex items-center gap-2 text-gray-700">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    Description length okay
                                </li>

                                <li className="flex items-center gap-2 text-gray-700">
                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                    No keyword found in title
                                </li>

                                <li className="flex items-center gap-2 text-gray-700">
                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                    Image missing alt text
                                </li>

                            </ul>

                        </div>

                    </div>
                </div>

            </form>

            {showGenerating && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl p-6 w-[420px] relative">

                        <button
                            onClick={() => setShowGenerating(false)}
                            className="absolute top-3 right-4 text-gray-600"
                        >
                            ✕
                        </button>

                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                        </div>

                        <p className="text-center text-sm text-gray-600 italic">
                            Generating Sitemap....
                        </p>

                    </div>

                </div>
            )}


            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl p-6 w-[420px] text-center relative">

                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-3 right-4 text-gray-600"
                        >
                            ✕
                        </button>

                        {/* Icon */}
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                            ✓
                        </div>

                        <h3 className="text-lg font-semibold mb-1">
                            Sitemap Generated!
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                            Sitemap has been generated successfully
                        </p>

                        <div className="text-left text-sm space-y-2">
                            <p>
                                <span className="font-medium">URL:</span>{" "}
                                <a href="#" className="text-blue-500">sitemap.xml</a>
                            </p>

                            <p>
                                <span className="font-medium">Download Link:</span>{" "}
                                <a href="#" className="text-blue-500">sitemap.xml</a>
                            </p>
                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

export default CreateSEOSetting
