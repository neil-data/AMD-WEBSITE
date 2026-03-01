"use client";

import Editor from "@monaco-editor/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function MonacoSkillEditor() {
  const [text, setText] = useState("function solve(input) {\n  return input;\n}");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  const metrics = useMemo(() => ({ chars: text.length, lines: text.split("\n").length }), [text]);

  async function copySnippet() {
    await navigator.clipboard.writeText(text);
    push("Snippet copied", "success");
  }

  async function evaluate() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    push("Evaluation queued", "info");
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Skill Editor</h3>
        <p className="text-xs text-text-secondary">
          {metrics.lines} lines · {metrics.chars} chars
        </p>
      </div>
      <div className="h-52 overflow-hidden rounded-xl border border-border">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={text}
          onChange={(next) => setText(next ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            wordWrap: "on"
          }}
          theme="vs-dark"
        />
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={evaluate} loading={loading}>
          Run AI Evaluation
        </Button>
        <Button onClick={copySnippet}>Copy</Button>
      </div>
    </Card>
  );
}