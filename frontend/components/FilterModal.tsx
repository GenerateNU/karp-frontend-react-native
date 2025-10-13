import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { EventFilters } from '@/services/api';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: EventFilters) => void;
  currentFilters: EventFilters;
}

const SORT_OPTIONS = [
  'Category',
  'Location',
  'Availability',
  'Been Before',
  'New Additions',
  'Recs for You',
];

const CAUSE_AREAS = [
  'Agriculture',
  'Animals',
  'Arts & Culture',
  'Civic Engagement',
  'Climate Change',
  'Conflict Resolution',
  'Community Development',
  'Education',
  'Energy',
  'Disability',
  'Disaster Relief',
  'Economic Development',
  'Environment & Sustainability',
  'Financial Literacy',
  'Health & Medicine',
  'Housing & Homelessness',
  'Human Rights',
  'Immigration & Refugees',
  'Job & Workplace',
  'LGBTQ',
  'Mental Health',
  'Philanthropy',
  'Poverty',
  'Research',
  'Seniors & Retirement',
];

const SKILLS = [
  'Advocacy',
  'Animal Care',
  'Archiving/Data Entry',
  'Arts & Crafts',
  'Board/Committee',
  'Community Engagement',
  'Conservation',
  'Development/Fundraising',
  'Elder Care',
  'Food Delivery/Distribution',
  'Languages',
  'Mentor/Tutor',
  'Music',
  'Outreach',
  'Research',
  'Volunteer Coordination',
  'Writing/Journalism',
  'IT',
];

const GOOD_FOR = [
  'Middle School',
  'High School',
  'Interns',
  'Entry-Level Positions',
  'Youth Groups/Scouts',
  'College Students',
  'After School/Evening Availability',
  'Adults 55+',
  'Service Learning/Class Credit',
  'Faith-Based Volunteering',
  'Remote/Virtual',
  'Team Volunteering',
];

export function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<EventFilters>(currentFilters);
  const [expandedSections, setExpandedSections] = useState({
    causeAreas: false,
    skills: false,
    goodFor: false,
  });
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedCauseAreas, setSelectedCauseAreas] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGoodFor, setSelectedGoodFor] = useState<string[]>([]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: EventFilters = {};
    setFilters(resetFilters);
    setSelectedSort('');
    setSelectedCauseAreas([]);
    setSelectedSkills([]);
    setSelectedGoodFor([]);
    onApplyFilters(resetFilters);
    onClose();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCauseArea = (area: string) => {
    setSelectedCauseAreas(prev =>
      prev.includes(area) ? prev.filter(item => item !== area) : [...prev, area]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(item => item !== skill)
        : [...prev, skill]
    );
  };

  const toggleGoodFor = (item: string) => {
    setSelectedGoodFor(prev =>
      prev.includes(item)
        ? prev.filter(selected => selected !== item)
        : [...prev, item]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
          <Pressable onPress={onClose} className="py-2">
            <Text className="text-base text-gray-600">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">Filter</Text>
          <Pressable onPress={handleReset} className="py-2">
            <Text className="text-base text-blue-500">Clear</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          {/* Sort By Section */}
          <View className="my-4">
            <Text className="mb-3 text-base font-semibold text-gray-900">
              Sort By
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SORT_OPTIONS.map(option => (
                <Pressable
                  key={option}
                  className={`rounded-lg border px-3 py-2 ${
                    selectedSort === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-100'
                  }`}
                  onPress={() =>
                    setSelectedSort(selectedSort === option ? '' : option)
                  }
                >
                  <Text
                    className={`text-sm ${
                      selectedSort === option
                        ? 'text-blue-500'
                        : 'text-gray-600'
                    }`}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Filters Section */}
          <View className="my-4">
            <Text className="mb-3 text-base font-semibold text-gray-900">
              Filters
            </Text>

            {/* CAUSE AREAS */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-200 py-3"
              onPress={() => toggleSection('causeAreas')}
            >
              <Text className="text-base font-medium text-gray-900">
                CAUSE AREAS
              </Text>
              <Text className="text-lg text-gray-500">
                {expandedSections.causeAreas ? '▲' : '▼'}
              </Text>
            </Pressable>

            {expandedSections.causeAreas && (
              <View className="py-3">
                <View className="flex-row flex-wrap gap-2">
                  {CAUSE_AREAS.map(area => (
                    <Pressable
                      key={area}
                      className={`rounded-lg border px-2 py-1 ${
                        selectedCauseAreas.includes(area)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onPress={() => toggleCauseArea(area)}
                    >
                      <Text
                        className={`text-xs ${
                          selectedCauseAreas.includes(area)
                            ? 'text-blue-500'
                            : 'text-gray-600'
                        }`}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* SKILLS */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-200 py-3"
              onPress={() => toggleSection('skills')}
            >
              <Text className="text-base font-medium text-gray-900">
                SKILLS
              </Text>
              <Text className="text-lg text-gray-500">
                {expandedSections.skills ? '▲' : '▼'}
              </Text>
            </Pressable>

            {expandedSections.skills && (
              <View className="py-3">
                <View className="flex-row flex-wrap gap-2">
                  {SKILLS.map(skill => (
                    <Pressable
                      key={skill}
                      className={`rounded-lg border px-2 py-1 ${
                        selectedSkills.includes(skill)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onPress={() => toggleSkill(skill)}
                    >
                      <Text
                        className={`text-xs ${
                          selectedSkills.includes(skill)
                            ? 'text-blue-500'
                            : 'text-gray-600'
                        }`}
                      >
                        {skill}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* GOOD FOR */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-200 py-3"
              onPress={() => toggleSection('goodFor')}
            >
              <Text className="text-base font-medium text-gray-900">
                GOOD FOR
              </Text>
              <Text className="text-lg text-gray-500">
                {expandedSections.goodFor ? '▲' : '▼'}
              </Text>
            </Pressable>

            {expandedSections.goodFor && (
              <View className="py-3">
                <View className="flex-row flex-wrap gap-2">
                  {GOOD_FOR.map(item => (
                    <Pressable
                      key={item}
                      className={`rounded-lg border px-2 py-1 ${
                        selectedGoodFor.includes(item)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onPress={() => toggleGoodFor(item)}
                    >
                      <Text
                        className={`text-xs ${
                          selectedGoodFor.includes(item)
                            ? 'text-blue-500'
                            : 'text-gray-600'
                        }`}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="border-t border-gray-200 p-4">
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 items-center rounded-lg border border-gray-300 py-3"
              onPress={handleReset}
            >
              <Text className="text-base font-medium text-gray-700">Clear</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-lg bg-blue-500 py-3"
              onPress={handleApply}
            >
              <Text className="text-base font-semibold text-white">Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
