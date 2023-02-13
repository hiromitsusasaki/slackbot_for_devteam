import { DefineFunction, Schema, SlackFunction,  } from "deno-slack-sdk/mod.ts";

export const RemoveMentionFromMessageFunctionDefinition = DefineFunction({
  callback_id: "remove_mention_from_message_function",
  title: "Remove Mention From Message Function",
  description: "A function to remove mention from message",
  source_file: "functions/remove_mention_from_message_function.ts",
  input_parameters: {
    properties: {
      source_message: {
        type: Schema.types.string,
        description: "Source message text"
      },
    },
    required: ["source_message"],
  },
  output_parameters: {
    properties: {
      formatted_message: {
        type: Schema.types.string,
        description: "Formatted message text",
      },
    },
    required: ["formatted_message"]
  },
});

export default SlackFunction(
  RemoveMentionFromMessageFunctionDefinition,
  ({ inputs }) => {
    console.log(inputs.source_message);
    const formatted_message = inputs.source_message.replace(/<@.*>/, "");
    return { outputs: { formatted_message } };
  }
);
