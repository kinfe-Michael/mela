

import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/util/dbUtil'; 


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q'); 

    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json(
        { error: 'Search term is required.' },
        { status: 400 } 
      );
    }

    const results = await searchProducts(searchTerm);
    console.log(results)
    return NextResponse.json({ products: results }, { status: 200 });
  } catch (error) {
    console.error('API search error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch search results due to an internal server error.' },
      { status: 500 } 
    );
  }
}


