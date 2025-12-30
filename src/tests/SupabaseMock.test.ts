function createSupabaseMock(response: any) {
  return {
    from: () => ({
      select: () => ({
        order: () => response
      }),
      insert: () => ({
        select: () => response
      }),
      update: () => ({
        eq: () => response
      }),
      eq: () => ({
        single: () => response
      })
    })
  } as any;
}
export { createSupabaseMock };