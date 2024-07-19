group "default" {
    targets = ["tasks"]
}

target "ctx" {
  context = "."
  target = "ctx"
}

target "tasks" {
    name = try("${item.task}_${replace(item.deno_version, ".", "-")}", item.task)
    matrix = {
        item = [
          { task = "lint" },
          { task = "fmt" },
          { task = "typecheck" },
          { task = "test", deno_version = "latest" },
          { task = "test", deno_version = "1.45.2" },
      ],
    }
    contexts = { ctx = "target:ctx" }
    args = {
      DENO_VERSION = try(item.deno_version, null),
      TASK_NAME = item.task
    }
    target = "task"
    // tests can be non-deterministic, so always re-run them
    no-cache-filter = item.task == "test" ? ["task"] : []
    output = ["type=cacheonly"]  # don't export the result
}
