import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Click Me",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["black", "white", "empty"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Black: Story = {
  args: {
    children: "Black Button",
    variant: "primary",
  },
};

export const White: Story = {
  args: {
    children: "White Button",
    variant: "secondary",
  },
};

export const Empty: Story = {
  args: {
    children: "Ghost Button",
    variant: "empty",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true,
  },
};

export const CustomClass: Story = {
  args: {
    children: "Custom Style",
    className: "rounded-full px-8 text-sm",
    variant: "secondary",
  },
};
