import React from "react";
import * as Tabs from "@radix-ui/react-tabs";

const PodcastDrawerTabs = () => (
  <Tabs.Root defaultValue="tab1">
    <Tabs.List aria-label="Manage your account">
      <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
      <Tabs.Trigger value="tab2">Password</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="tab1">Tab 1 content</Tabs.Content>
    <Tabs.Content value="tab2">Tab 2 content</Tabs.Content>
  </Tabs.Root>
);

export default PodcastDrawerTabs;
