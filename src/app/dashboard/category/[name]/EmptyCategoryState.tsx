import { Card } from "@/components/Card";
import env from "@/env";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const EmptyCategoryState = ({
  categoryName,
}: {
  categoryName: string;
}) => {
  const codeSnippet = `await fetch('${env.NEXT_PUBLIC_BASE_URL}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: '${categoryName}',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`;
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    queryFn: async () => {
      const res = await api.categories["poll-category"][":name"].$get({
        param: { name: categoryName },
      });
      const data = await res.json();
      return data;
    },
    refetchInterval(query) {
      return query.state.data?.hasEvents ? false : 1000;
    },
  });

  const hasEvents = data?.hasEvents;

  useEffect(() => {
    if (hasEvents) {
      router.refresh();
    }
  }, [hasEvents, router]);
  return (
    <Card
      content="max-w-2xl w-full flex flex-col items-center p-6"
      className="flex flex-1 items-center justify-center"
    >
      <h2 className="text-center text-xl/8 font-medium tracking-tight text-gray-950">
        Create your first {categoryName}
      </h2>

      <p className="max-w-md text-pretty text-center text-sm/6 text-gray-600">
        Get started by sending to our request API
      </p>

      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400">your-first-event.js</span>
        </div>
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{
            borderRadius: "0px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      </div>

      <div className="mt-8 flex flex-col items-center space-x-2">
        <div className="flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">
            Listening to incoming events...
          </span>
        </div>
        <p className="text-sm/6 text-gray-600">
          Need help ? check out our{" "}
          <a href="#" className="text-blue-600">
            Documentation
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600">
            Contact support
          </a>
          .
        </p>
      </div>
    </Card>
  );
};
