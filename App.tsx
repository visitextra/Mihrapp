import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import Page_0 from "./pages/_index.tsx";
import PageLayout_0 from "./pages/_index.pageLayout.tsx";
import Page_1 from "./pages/privacy-policy.tsx";
import PageLayout_1 from "./pages/privacy-policy.pageLayout.tsx";
import Page_2 from "./pages/terms-of-service.tsx";
import PageLayout_2 from "./pages/terms-of-service.pageLayout.tsx";
import Page_3 from "./pages/kuran.tsx";
import PageLayout_3 from "./pages/kuran.pageLayout.tsx";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([
  ["./pages/_index.tsx", "/"],
  ["./pages/privacy-policy.tsx", "/privacy-policy"],
  ["./pages/terms-of-service.tsx", "/terms-of-service"],
  ["./pages/kuran.tsx", "/kuran"]
]);
const fileNameToComponent = new Map([
  ["./pages/_index.tsx", Page_0],
  ["./pages/privacy-policy.tsx", Page_1],
  ["./pages/terms-of-service.tsx", Page_2],
  ["./pages/kuran.tsx", Page_3]
]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalContextProviders>
        <Routes>
          {toElement({ trie: buildLayoutTrie({
"./pages/_index.tsx": PageLayout_0,
"./pages/privacy-policy.tsx": PageLayout_1,
"./pages/terms-of-service.tsx": PageLayout_2,
"./pages/kuran.tsx": PageLayout_3,
}), fileNameToRoute, makePageRoute })} 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}
