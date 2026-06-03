// Create a new file: hooks/useAttributeSetStructure.ts
import { useEffect, useState } from 'react';
import { useGetAttributeSetStructureQuery } from '../app/api/AttributeSetSlices/AttributeSetApi';

interface AttributeSetAttribute {
  attribute_id: number;
  attribute_code: string;
  frontend_label: string;
  sort_order: number;
  is_system: boolean;
  is_required: boolean;
  frontend_input?: string;
  default_value?: any;
  options?: Array<{ value: string; label: string }>;
}

interface AttributeGroup {
  attribute_group_id: number;
  attribute_group_name: string;
  sort_order: number;
  attributes: AttributeSetAttribute[];
}

interface AttributeSetStructure {
  attribute_set_id: number;
  attribute_set_name: string;
  groups: AttributeGroup[];
  unassigned_attributes: AttributeSetAttribute[];
}

export const useAttributeSetStructure = (vendorUuid: string, attributeSetId: number) => {
  const { data, isLoading, error } = useGetAttributeSetStructureQuery(
    { vendor_uuid: vendorUuid, id: attributeSetId.toString() },
    { skip: !vendorUuid || !attributeSetId }
  );

  const [structure, setStructure] = useState<AttributeSetStructure | null>(null);
  const [groupedAttributes, setGroupedAttributes] = useState<AttributeGroup[]>([]);

  useEffect(() => {
    if (data?.success && data?.data) {
      setStructure(data.data);
      // Filter out groups with no attributes and sort by sort_order
      const sortedGroups = [...(data.data.groups || [])]
        .filter(group => group.attributes && group.attributes.length > 0)
        .sort((a, b) => a.sort_order - b.sort_order);
      setGroupedAttributes(sortedGroups);
    }
  }, [data]);

  return {
    structure,
    groupedAttributes,
    isLoading,
    error
  };
};