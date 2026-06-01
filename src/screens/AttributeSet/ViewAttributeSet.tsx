// src/screens/AttributeSet/ViewAttributeSet.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Layers,
    Loader2,
    X,
    Plus,
    Trash2,
    Edit2,
    Check,
    AlertCircle,
    CheckCircle,
    Clock,
    Tag,
    Search,
    ChevronRight,
    ChevronDown,
    MoveRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetAttributeSetQuery,
    useGetAttributeSetStructureQuery,
    useUpdateAttributeSetMutation,
    useAssignAttributeToSetMutation,
    useRemoveAttributeFromSetMutation,
    useCreateAttributeGroupMutation,
    useUpdateAttributeGroupMutation,
    useDeleteAttributeGroupMutation,
} from '../../app/api/AttributeSetSlices/AttributeSetApi';
import { ROUTES } from '../../router';

interface Group {
    attribute_group_id: number;
    attribute_group_name: string;
    sort_order: number;
    attributes: Attribute[];
}

interface Attribute {
    attribute_id: number;
    attribute_code: string;
    frontend_label: string;
    sort_order?: number;
    is_system?: boolean;
    is_required?: boolean;
}

export const ViewAttributeSet: React.FC = () => {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();
    const [searchParams] = useSearchParams();
    const vendorUuid = searchParams.get('vendor') || '';

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [editingGroupName, setEditingGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchUnassignedTerm, setSearchUnassignedTerm] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
    const [isEditingSetName, setIsEditingSetName] = useState(false);
    const [editSetName, setEditSetName] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [unassigningAttributeId, setUnassigningAttributeId] = useState<number | null>(null);
    const [showAllUnassigned, setShowAllUnassigned] = useState(false);

    // Queries
    const { 
        data: attributeSetData, 
        isLoading: isLoadingSet, 
        refetch: refetchSet 
    } = useGetAttributeSetQuery(
        { vendor_uuid: vendorUuid, id: uuid! },
        { skip: !vendorUuid || !uuid }
    );

    const { 
        data: structureData, 
        isLoading: isLoadingStructure,
        refetch: refetchStructure,
        error: structureError
    } = useGetAttributeSetStructureQuery(
        { vendor_uuid: vendorUuid, id: uuid! },
        { skip: !vendorUuid || !uuid }
    );

    // Mutations
    const [updateAttributeSet, { error: updateError }] = useUpdateAttributeSetMutation();
    const [assignAttribute, { error: assignError }] = useAssignAttributeToSetMutation();
    const [removeAttribute, { error: removeError }] = useRemoveAttributeFromSetMutation();
    const [createGroup, { error: createGroupError }] = useCreateAttributeGroupMutation();
    const [updateGroup, { error: updateGroupError }] = useUpdateAttributeGroupMutation();
    const [deleteGroup, { error: deleteGroupError }] = useDeleteAttributeGroupMutation();

    const attributeSet = attributeSetData?.data;
    const structure = structureData?.data;
    
    // Get groups from structure
    const groups = (structure?.groups as Group[]) || [];
    const unassignedAttributes = (structure?.unassigned_attributes as Attribute[]) || [];

    // Log errors for debugging
    useEffect(() => {
        if (structureError) {
            console.error('Structure Error:', structureError);
            toast.error('Failed to load attribute set structure');
        }
        if (updateError) {
            console.error('Update Error:', updateError);
            toast.error('Failed to update attribute set');
        }
        if (assignError) {
            console.error('Assign Error:', assignError);
            toast.error('Failed to assign attribute');
        }
        if (removeError) {
            console.error('Remove Error:', removeError);
            toast.error('Failed to remove attribute');
        }
    }, [structureError, updateError, assignError, removeError]);

    // Initialize expanded groups and selected group
    useEffect(() => {
        if (groups && groups.length > 0) {
            const newExpanded = new Set<number>();
            groups.slice(0, 3).forEach(group => {
                newExpanded.add(group.attribute_group_id);
            });
            setExpandedGroups(newExpanded);
            
            if (!selectedGroupId && groups[0]) {
                setSelectedGroupId(groups[0].attribute_group_id);
            }
        }
    }, [groups]);

    const handleUpdateSetName = async () => {
        if (!editSetName.trim()) {
            toast.error('Attribute set name cannot be empty');
            return;
        }

        const loadingToast = toast.loading('Updating attribute set name...');
        try {
            const result = await updateAttributeSet({
                vendor_uuid: vendorUuid,
                id: uuid!,
                data: { 
                    attribute_set_name: editSetName, 
                    sync_to_magento: true 
                },
            }).unwrap();
            
            toast.success(result.message || 'Attribute set name updated', { id: loadingToast });
            setIsEditingSetName(false);
            await refetchSet();
            await refetchStructure();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update attribute set name', { id: loadingToast });
        }
    };

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error('Please enter a group name');
            return;
        }

        const loadingToast = toast.loading('Creating group...');
        try {
            const result = await createGroup({
                vendor_uuid: vendorUuid,
                attributeSetId: uuid!,
                data: { 
                    attribute_group_name: newGroupName, 
                    sort_order: groups.length 
                },
            }).unwrap();
            
            toast.success(result.message || 'Group created successfully', { id: loadingToast });
            setIsAddingGroup(false);
            setNewGroupName('');
            await refetchStructure();
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to create group', { id: loadingToast });
        }
    };

    const handleUpdateGroup = async (groupId: number, newName: string) => {
        if (!newName.trim()) {
            toast.error('Group name cannot be empty');
            return;
        }

        const loadingToast = toast.loading('Renaming group...');
        try {
            const result = await updateGroup({
                vendor_uuid: vendorUuid,
                attributeSetId: uuid!,
                groupId,
                name: newName,
            }).unwrap();
            
            toast.success(result.message || 'Group renamed successfully', { id: loadingToast });
            setEditingGroupId(null);
            setEditingGroupName('');
            await refetchStructure();
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to rename group', { id: loadingToast });
        }
    };

    const handleDeleteGroup = async (groupId: number) => {
        if (!confirm('Are you sure you want to delete this group? Attributes will be moved to Unassigned.')) {
            return;
        }

        const loadingToast = toast.loading('Deleting group...');
        try {
            const result = await deleteGroup({
                vendor_uuid: vendorUuid,
                attributeSetId: uuid!,
                groupId,
            }).unwrap();
            
            toast.success(result.message || 'Group deleted successfully', { id: loadingToast });
            if (selectedGroupId === groupId) {
                setSelectedGroupId(groups[0]?.attribute_group_id || null);
            }
            await refetchStructure();
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to delete group', { id: loadingToast });
        }
    };

    const handleAssignAttribute = async (attributeId: number, groupId: number) => {
        setIsAssigning(true);
        const loadingToast = toast.loading('Assigning attribute to group...');
        try {
            const result = await assignAttribute({
                vendor_uuid: vendorUuid,
                id: uuid!,
                data: {
                    attribute_id: attributeId,
                    attribute_group_id: groupId,
                    sort_order: 0,
                },
            }).unwrap();
            
            toast.success(result.message || 'Attribute assigned to group successfully', { id: loadingToast });
            await refetchStructure();
        } catch (error: any) {
            toast.error(error?.data?.error || 'Failed to assign attribute', { id: loadingToast });
        } finally {
            setIsAssigning(false);
        }
    };

    const handleUnassignAttribute = async (attributeId: number) => {
        setUnassigningAttributeId(attributeId);
        const loadingToast = toast.loading('Unassigning attribute...');
        try {
            const result = await removeAttribute({
                vendor_uuid: vendorUuid,
                id: uuid!,
                attributeId,
            }).unwrap();
            
            toast.success(result.message || 'Attribute unassigned successfully', { id: loadingToast });
            await refetchStructure();
        } catch (error: any) {
            console.error('Unassign error:', error);
            const errorMsg = error?.data?.error || error?.data?.message || 'Failed to unassign attribute';
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setUnassigningAttributeId(null);
        }
    };

    const toggleGroupExpand = (groupId: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId);
        } else {
            newExpanded.add(groupId);
        }
        setExpandedGroups(newExpanded);
    };

    const filteredGroups = groups.filter(group =>
        group.attribute_group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUnassignedAttributes = unassignedAttributes.filter(attr =>
        attr.attribute_code.toLowerCase().includes(searchUnassignedTerm.toLowerCase()) ||
        attr.frontend_label.toLowerCase().includes(searchUnassignedTerm.toLowerCase())
    );

    const getSyncStatusBadge = (status: string) => {
        switch (status) {
            case 'synced':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Synced</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Pending</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3" /> Failed</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    const isLoading = isLoadingSet || isLoadingStructure;
    const totalAttributes = groups.reduce((total, group) => total + group.attributes.length, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                    <p className="mt-2 text-gray-500">Loading attribute set...</p>
                </div>
            </div>
        );
    }

    if (!attributeSet) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <X className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="mt-2 text-gray-500">Attribute set not found</p>
                    <button
                        onClick={() => navigate(ROUTES.ATTRIBUTE_SET_LISTS + `?vendor=${vendorUuid}`)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    const selectedGroup = groups.find(g => g.attribute_group_id === selectedGroupId);
    const groupAttributes = selectedGroupId ? (selectedGroup?.attributes || []) : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(ROUTES.ATTRIBUTE_SET_LISTS + `?vendor=${vendorUuid}`)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Layers className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        {isEditingSetName ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editSetName}
                                                    onChange={(e) => setEditSetName(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleUpdateSetName}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingSetName(false)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl font-bold text-gray-900">{attributeSet.attribute_set_name}</h1>
                                                <button
                                                    onClick={() => {
                                                        setEditSetName(attributeSet.attribute_set_name);
                                                        setIsEditingSetName(true);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Edit name"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {attributeSet.local_display_name && (
                                            <p className="text-sm text-gray-500">For internal use: {attributeSet.local_display_name}</p>
                                        )}
                                        {getSyncStatusBadge(attributeSet.sync_status)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAllUnassigned(!showAllUnassigned)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    showAllUnassigned 
                                        ? 'bg-purple-600 text-white' 
                                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <MoveRight className="w-4 h-4" />
                                Unassigned Attributes ({unassignedAttributes.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Show Unassigned Attributes Section when toggled */}
                {showAllUnassigned && (
                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Unassigned Attributes</h2>
                                <button
                                    onClick={() => setShowAllUnassigned(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative mt-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchUnassignedTerm}
                                    onChange={(e) => setSearchUnassignedTerm(e.target.value)}
                                    placeholder="Search unassigned attributes..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="p-4">
                            {filteredUnassignedAttributes.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No unassigned attributes found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredUnassignedAttributes.map((attr) => {
                                        const isSystemAttribute = attr.is_system === true;
                                        
                                        return (
                                            <div
                                                key={attr.attribute_id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{attr.attribute_code}</p>
                                                    <p className="text-xs text-gray-500">{attr.frontend_label}</p>
                                                    <p className="text-xs text-gray-400">ID: {attr.attribute_id}</p>
                                                    {isSystemAttribute && (
                                                        <span className="text-xs text-gray-400">(System)</span>
                                                    )}
                                                </div>
                                                <select
                                                    onChange={(e) => {
                                                        const groupId = parseInt(e.target.value);
                                                        if (groupId) {
                                                            handleAssignAttribute(attr.attribute_id, groupId);
                                                        }
                                                    }}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                    defaultValue=""
                                                    disabled={isAssigning || isSystemAttribute}
                                                >
                                                    <option value="">Assign to...</option>
                                                    {groups.map((group) => (
                                                        <option key={group.attribute_group_id} value={group.attribute_group_id}>
                                                            {group.attribute_group_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Groups */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900">Groups</h2>
                                    <button
                                        onClick={() => setIsAddingGroup(true)}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        + Add New
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Filter groups..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Double click on a group to rename it.</p>
                            </div>

                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {filteredGroups.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <p>No groups found</p>
                                        <button
                                            onClick={() => setIsAddingGroup(true)}
                                            className="mt-2 text-sm text-purple-600"
                                        >
                                            + Create First Group
                                        </button>
                                    </div>
                                ) : (
                                    filteredGroups.map((group) => {
                                        const groupId = group.attribute_group_id;
                                        const isExpanded = expandedGroups.has(groupId);
                                        
                                        return (
                                            <div key={group.attribute_group_id}>
                                                <div
                                                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        selectedGroupId === groupId ? 'bg-purple-50' : ''
                                                    }`}
                                                    onClick={() => setSelectedGroupId(groupId)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleGroupExpand(groupId);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                        </button>
                                                        {editingGroupId === groupId ? (
                                                            <input
                                                                type="text"
                                                                value={editingGroupName}
                                                                onChange={(e) => setEditingGroupName(e.target.value)}
                                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleUpdateGroup(groupId, editingGroupName);
                                                                    }
                                                                    if (e.key === 'Escape') {
                                                                        setEditingGroupId(null);
                                                                        setEditingGroupName('');
                                                                    }
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <span
                                                                className="text-sm font-medium text-gray-700 flex-1"
                                                                onDoubleClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingGroupId(groupId);
                                                                    setEditingGroupName(group.attribute_group_name);
                                                                }}
                                                            >
                                                                {group.attribute_group_name}
                                                                <span className="text-xs text-gray-400 ml-1">({group.attributes.length})</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    {groups.length > 1 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteGroup(groupId);
                                                            }}
                                                            className="p-1 text-red-400 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {isExpanded && (
                                                    <div className="pl-8 pr-3 pb-2 space-y-1">
                                                        {group.attributes.length === 0 ? (
                                                            <p className="text-xs text-gray-400 italic py-1">No attributes</p>
                                                        ) : (
                                                            group.attributes.map((attr) => {
                                                                const isSystemAttribute = attr.is_system === true;
                                                                
                                                                return (
                                                                    <div key={attr.attribute_id} className="flex items-center justify-between text-xs py-1">
                                                                        <div className="flex items-center gap-2 flex-1">
                                                                            <span className="text-gray-600 truncate">{attr.attribute_code}</span>
                                                                            {isSystemAttribute && (
                                                                                <span className="text-xs text-gray-400">(System)</span>
                                                                            )}
                                                                            {attr.is_required && (
                                                                                <span className="text-xs text-red-400">(Required)</span>
                                                                            )}
                                                                        </div>
                                                                        {!isSystemAttribute ? (
                                                                            <button
                                                                                onClick={() => handleUnassignAttribute(attr.attribute_id)}
                                                                                disabled={unassigningAttributeId === attr.attribute_id}
                                                                                className="text-red-400 hover:text-red-600 ml-2 disabled:opacity-50"
                                                                                title="Unassign from group"
                                                                            >
                                                                                {unassigningAttributeId === attr.attribute_id ? (
                                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                                ) : (
                                                                                    <X className="w-3 h-3" />
                                                                                )}
                                                                            </button>
                                                                        ) : (
                                                                            <span 
                                                                                className="text-gray-300 text-xs ml-2 cursor-help" 
                                                                                title="System attributes cannot be unassigned from the attribute set"
                                                                            >
                                                                                🔒
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}

                                {isAddingGroup && (
                                    <div className="p-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newGroupName}
                                                onChange={(e) => setNewGroupName(e.target.value)}
                                                placeholder="New group name"
                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddGroup();
                                                    if (e.key === 'Escape') {
                                                        setIsAddingGroup(false);
                                                        setNewGroupName('');
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={handleAddGroup}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingGroup(false);
                                                    setNewGroupName('');
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Attributes in Selected Group */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {selectedGroup ? selectedGroup.attribute_group_name : 'Select a Group'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Assigned Attributes ({groupAttributes.length})
                                </p>
                            </div>

                            <div className="p-4">
                                {!selectedGroupId ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Select a group from the left to view its attributes</p>
                                    </div>
                                ) : groupAttributes.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-500">No attributes assigned to this group</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Click on "Unassigned Attributes" to view and assign attributes
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {groupAttributes.map((attr) => {
                                            const isSystemAttribute = attr.is_system === true;
                                            
                                            return (
                                                <div
                                                    key={attr.attribute_id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium text-gray-900">{attr.attribute_code}</span>
                                                            {isSystemAttribute && (
                                                                <span className="text-xs text-gray-400">(System)</span>
                                                            )}
                                                            {attr.is_required && (
                                                                <span className="text-xs text-red-400">(Required)</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">{attr.frontend_label}</p>
                                                        <p className="text-xs text-gray-400 mt-1">ID: {attr.attribute_id}</p>
                                                    </div>
                                                    {!isSystemAttribute ? (
                                                        <button
                                                            onClick={() => handleUnassignAttribute(attr.attribute_id)}
                                                            disabled={unassigningAttributeId === attr.attribute_id}
                                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Unassign from group"
                                                        >
                                                            {unassigningAttributeId === attr.attribute_id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span 
                                                            className="p-1.5 text-gray-300 cursor-help" 
                                                            title="System attributes cannot be unassigned from the attribute set"
                                                        >
                                                            🔒
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <p className="text-xs text-gray-500">Total Attributes</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAttributes}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <p className="text-xs text-gray-500">Total Groups</p>
                                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <p className="text-xs text-gray-500">Unassigned</p>
                                <p className="text-2xl font-bold text-gray-900">{unassignedAttributes.length}</p>
                            </div>
                        </div>

                        {/* Sync Error Message */}
                        {attributeSet.sync_status === 'failed' && attributeSet.sync_error_message && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Sync Failed</p>
                                        <p className="text-xs text-red-600 mt-1">{attributeSet.sync_error_message}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};