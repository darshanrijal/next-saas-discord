"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string | null;
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId ?? "");

  const { mutate, isPending } = useMutation({
    mutationFn: api.project["set-discord-id"].$patch,
  });
  return (
    <Card className="w-full max-w-xl space-y-4">
      <div>
        <Label>Discord ID</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your discord id"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don't know how to find your discord id ?{" "}
        <a
          href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 hover:text-brand-500"
        >
          Learn how to obtain it here
        </a>
        .
      </p>

      <div className="pt-4">
        <Button
          onClick={() => mutate({ query: { discordId } })}
          disabled={isPending || discordId === initialDiscordId}
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </Card>
  );
};
