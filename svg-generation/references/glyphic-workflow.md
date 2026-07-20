# Glyphic Workflow Reference

Full JSON examples for each supported diagram type in Route 2.

---

## flowchart / architecture

```json
{
  "type": "architecture",
  "title": "Web App Architecture",
  "direction": "TB",
  "theme": "dark",
  "style": "compact",
  "nodes": [
    { "id": "web", "label": "Web App", "shape": "rounded", "icon": "fab-react" },
    { "id": "api", "label": "API Gateway", "shape": "hexagon", "icon": "fas-bolt" },
    { "id": "db", "label": "PostgreSQL", "shape": "database", "icon": "fas-database" }
  ],
  "edges": [
    { "source": "web", "target": "api", "label": "REST" },
    { "source": "api", "target": "db", "label": "SQL" }
  ]
}
```

Nested groups (VPC/cluster):

```json
{
  "type": "architecture",
  "nodes": [
    { "id": "web1", "label": "Web 1", "groupId": "g_web" },
    { "id": "web2", "label": "Web 2", "groupId": "g_web" },
    { "id": "db", "label": "DB", "shape": "database" }
  ],
  "edges": [
    { "source": "web1", "target": "db" },
    { "source": "web2", "target": "db" }
  ]
}
```

---

## sequence

```json
{
  "type": "sequence",
  "participants": [
    { "id": "user", "label": "User", "shape": "actor" },
    { "id": "api", "label": "API", "shape": "service" },
    { "id": "db", "label": "Database", "shape": "database" }
  ],
  "messages": [
    { "source": "user", "target": "api", "label": "GET /users", "type": "sync" },
    { "source": "api", "target": "db", "label": "SELECT *", "type": "sync" },
    { "source": "db", "target": "api", "label": "results", "type": "return" },
    { "source": "api", "target": "user", "label": "200 OK", "type": "return" }
  ]
}
```

---

## erd

```json
{
  "type": "erd",
  "title": "Blog Schema",
  "entities": [
    {
      "id": "users",
      "attributes": [
        { "name": "id", "type": "uuid", "key": "PK" },
        { "name": "email", "type": "varchar" },
        { "name": "created_at", "type": "timestamp" }
      ]
    },
    {
      "id": "posts",
      "attributes": [
        { "name": "id", "type": "uuid", "key": "PK" },
        { "name": "author_id", "type": "uuid", "key": "FK" },
        { "name": "title", "type": "varchar" }
      ]
    }
  ],
  "relationships": [
    { "from": "users", "to": "posts", "cardinality": "one-to-many", "label": "writes" }
  ]
}
```

---

## class (UML)

```json
{
  "type": "class",
  "classes": [
    {
      "id": "Shape",
      "methods": ["+ area(): number", "+ perimeter(): number"]
    },
    {
      "id": "Circle",
      "attributes": ["- r: number"],
      "methods": ["+ area(): number"]
    }
  ],
  "relationships": [
    { "from": "Circle", "to": "Shape", "type": "inheritance" }
  ]
}
```

---

## c4

```json
{
  "type": "c4",
  "elements": [
    { "id": "u", "label": "Customer", "kind": "person" },
    { "id": "sys", "label": "Banking System", "kind": "system" },
    { "id": "db", "label": "Accounts DB", "kind": "database", "parent": "sys" }
  ],
  "relationships": [
    { "from": "u", "to": "sys", "label": "Uses", "technology": "HTTPS" }
  ]
}
```

---

## mindmap

```json
{
  "type": "mindmap",
  "nodes": [
    { "id": "root", "label": "Project" },
    { "id": "a", "label": "Frontend", "icon": "fab-react" },
    { "id": "b", "label": "Backend", "icon": "fas-server" },
    { "id": "c", "label": "Database", "icon": "fas-database" }
  ],
  "edges": [
    { "source": "root", "target": "a" },
    { "source": "root", "target": "b" },
    { "source": "root", "target": "c" }
  ]
}
```

---

## gantt

```json
{
  "type": "gantt",
  "sections": [
    {
      "label": "Phase 1",
      "tasks": [
        { "id": "api", "label": "Build API", "start": 0, "duration": 5 },
        { "id": "ui", "label": "Build UI", "start": 3, "duration": 5, "dependencies": ["api"] }
      ]
    }
  ]
}
```

---

## git

```json
{
  "type": "git",
  "commits": [
    { "id": "c1", "message": "initial commit", "branch": "main" },
    { "id": "c2", "message": "feature work", "branch": "dev", "parents": ["c1"] },
    { "id": "c3", "message": "merge", "branch": "main", "parents": ["c1", "c2"], "tag": "v1.0" }
  ]
}
```

---

## canvas (Freeform)

```json
{
  "type": "canvas",
  "width": 400,
  "height": 300,
  "elements": [
    { "type": "rect", "x": 20, "y": 20, "width": 360, "height": 260, "rx": 12, "fill": "#1e293b" },
    { "type": "circle", "cx": 200, "cy": 150, "r": 80, "fill": "#3b82f6" },
    { "type": "text", "x": 200, "y": 150, "content": "Hello", "textAnchor": "middle", "fill": "#fff", "fontSize": 24 }
  ]
}
```
