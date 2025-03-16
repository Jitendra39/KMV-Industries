export async function setupProductsTable() {
  const { error: createTableError } = await supabase.rpc("exec_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS products (
        name TEXT NOT NULL,
        images JSONB, 
        description TEXT,
        price TEXT NOT NULL,
        quantity TEXT NOT NULL,
        size TEXT
      );
    `,
  });

  if (createTableError) {
    console.error("Error creating products table:", createTableError);
    throw createTableError;
  }

  console.log("Products table created successfully");
  return true;
}

// create table admin (
//   id uuid primary key references auth.users(id) on delete cascade,
//   role text not null default 'admin'
// );
