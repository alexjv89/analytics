import CreateOrg from "./CreateProject";
import { createOrg } from "../action";

// Test utilities (for interaction tests)
import { screen, userEvent, expect, waitFor } from "storybook/test";

export default {
  title: "Pages/orgs/_components/CreateOrg",
  component: CreateOrg,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/orgs",
        query: {},
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const Default = {
  args: {},
};

export const HappyCase = {
  name: "Happy Case - Successful Org Creation",
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Tests successful organization creation flow with form submission and modal closure.",
      },
    },
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-green-50 rounded text-sm">
        <strong>Success Test:</strong> This story tests successful organization
        creation from backend.
      </div>
      <CreateOrg {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step("Mock successful org creation", async () => {
      createOrg.mockClear();
      createOrg.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
          createOrg: { id: "org-123", name: "Test Org" },
          createMembership: { id: "member-123" },
        };
      });
    });

    await step("Open create org modal", async () => {
      const triggerButton = screen.getByRole("button", { name: /create org/i });
      await userEvent.click(triggerButton);

      await expect(screen.getByRole("dialog")).toBeInTheDocument();
      await expect(
        screen.getByText("Create new Organisation")
      ).toBeInTheDocument();
    });

    await step("Fill and submit form", async () => {
      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await userEvent.type(nameInput, "Test Project");
      await userEvent.type(descriptionInput, "A test organization");

      const submitButton = screen.getByRole("button", { name: /^create$/i });
      await userEvent.click(submitButton);
    });

    await step("Verify loading state", async () => {
      await expect(screen.getByText("Creating...")).toBeInTheDocument();
      const submitButton = screen.getByRole("button", { name: /creating/i });
      await expect(submitButton).toBeDisabled();
    });

    await step("Verify successful completion", async () => {
      // Wait for modal to close (indicates success)
      await waitFor(
        () => {
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  },
};

export const ErrorCase = {
  name: "Error Case - Backend Failure",
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Tests error handling when backend fails during organization creation.",
      },
    },
  },
  render: (args) => (
    <div className="p-4">
      <div className="mb-4 p-3 bg-red-50 rounded text-sm">
        <strong>Error Test:</strong> This story tests error handling when
        backend returns an error.
      </div>
      <CreateOrg {...args} />
    </div>
  ),
  play: async ({ step }) => {
    await step("Mock backend error", async () => {
      createOrg.mockClear();

      createOrg.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockError = new Error("Database connection failed");
        throw mockError;
      });
    });

    await step("Open create org modal", async () => {
      const triggerButton = screen.getByRole("button", { name: /create org/i });
      await userEvent.click(triggerButton);

      await expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await step("Fill and submit form", async () => {
      const nameInput = screen.getByLabelText(/name/i);
      await userEvent.type(nameInput, "Test Project");

      const submitButton = screen.getByRole("button", { name: /^create$/i });
      await userEvent.click(submitButton);
    });

    await step("Verify loading state", async () => {
      await expect(screen.getByText("Creating...")).toBeInTheDocument();
    });

    await step("Verify error handling", async () => {
      await waitFor(
        () => {
          expect(
            screen.getByText("Database connection failed")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      await expect(screen.getByRole("dialog")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /^create$/i });
      await expect(submitButton).not.toBeDisabled();
      await expect(screen.getByText("Create")).toBeInTheDocument();
    });
  },
};
