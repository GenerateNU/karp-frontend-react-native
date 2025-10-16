import React, { useState } from 'react';
import EventsTab from '../../subtabs/eventsTab';
import OrgsTab from '../../subtabs/orgsTab';
import { View } from 'react-native';
import SubTabBar from '@/components/SubTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FypTabs() {
  const [activeTab, setActiveTab] = useState<'events' | 'orgs'>('events');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 bg-gray-50">
        <SubTabBar activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'events' ? <EventsTab /> : <OrgsTab />}
      </View>
    </SafeAreaView>
  );
}
