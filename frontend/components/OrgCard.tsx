import React, { useEffect, useState } from 'react';
import { FeedCard } from '@/components/FeedCard';
import { Organization } from '@/types/api/organization';
import { imageService } from '@/services/imageService';

interface OrgCardProps {
  organization: Organization;
  onPress?: (organization: Organization) => void;
}

export function OrgCard({ organization, onPress }: OrgCardProps) {
  const [imagePreSignedUrl, setImagePreSignedUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const url = await imageService.getImageUrl(
          'organization',
          organization.id
        );
        setImagePreSignedUrl(url);
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    }

    if (organization.imageS3Key) {
      console.log('organization key!');
      fetchImageUrl();
    }
  }, [organization.id, organization.imageS3Key]);

  return (
    <FeedCard
      feedItem={organization}
      onPressOrg={onPress}
      imgUrl={imagePreSignedUrl}
    />
  );
}
