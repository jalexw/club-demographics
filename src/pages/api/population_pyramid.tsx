// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og';

// Member Data Types & Util Functions
import { Gender, AnonymizedMember, decodeRow } from '@/member';
import DemographicBuckets, { GenderBuckets } from '@/components/DemographicBuckets';

export default function handler(
  req: NextRequest
) {
  const searchParams: URLSearchParams = req.nextUrl.searchParams;

  const title = searchParams.get("title") ?? "Population Pyramid";

  // Each observation/member's data is encoded in the query string as row=<encoded>
  // The encoded data is a string of the form <dob>-<gender>
  // The dob is a string of the form YYYY-MM-DD
  // The gender is a single letter, either M(ale), F(emale), or N(on-binary)
  const row: string[] = searchParams.getAll("row[]");
  let encodedRows: string[];
  if (!row) {
    encodedRows = []
  } else {
    encodedRows = Array.isArray(row) ? row : [row];
  }
  // The data of each encoded row should be exactly 12 characters
  if (encodedRows.some((encodedRow) => encodedRow.length !== 12)) {
    // TODO: Handle this error
    throw new Error("Row improperly encoded with anonymized member data");
  }

  // Convert strings into AnonymizedMember objects
  const rows: AnonymizedMember[] = encodedRows.map(decodeRow);

  // Split the rows into demographic buckets to be plotted
  const bucketedData = new DemographicBuckets(rows);
  const { Male, Female, NonBinary }: GenderBuckets = bucketedData.buckets;
  const [n_buckets, bucket_width] = bucketedData.bucketDetails;

  const largestBucket: number = Math.max(...Male, ...Female);

  const bucketLabels: JSX.Element[] = new Array(n_buckets + 1).fill(0).map(
    (_, i) => {
      const bucketStart: number = i * bucket_width;
      const bucketEnd: number = ((i + 1) * bucket_width) - 1;

      const isOverflowBucket: boolean = i === n_buckets;

      const bucketLabel: string = isOverflowBucket ?
          `${bucketStart}+` : `${bucketStart} to ${bucketEnd}`;

      return (
        <div
          key={`bucket-label-${i}`}
          tw="
            w-full
            flex
            justify-center
            items-center
          "
          style={{
            height: `${100 / (n_buckets + 1)}%`,
          }}
        >
          <p tw="text-lg text-center">{ bucketLabel }</p>
        </div>
      );
    }
  ).reverse();

  const maleBuckets: JSX.Element[] = Male.map((n_members, i) => {
    return (
      <div
        key={`male-${i}`}
        tw="
          bg-blue-400
          border
          border-gray-300
          flex
          justify-center
          items-center
        "
        style={{
          height: `${100 / (n_buckets + 1)}%`,
          width: `${(n_members / largestBucket) * 100}%`,
        }}
      >
        {
          n_members > 0 && (
            <p tw="text-white text-center">{ n_members }</p>
          )
        }
      </div>
    )
  }).reverse();

  const femaleBuckets: JSX.Element[] = Female.map((n_members, i) => {
    return (
      <div
        key={`female-${i}`}
        tw="
          bg-pink-400
          border
          border-gray-300
          flex
          justify-center
          items-center
        "
        style={{
          height: `${100 / (n_buckets + 1)}%`,
          width: `${(n_members / largestBucket) * 100}%`,
        }}
      >
        {
          n_members > 0 && (
            <p tw="text-white text-center">{ n_members }</p>
          )
        }
      </div>
    )
  }).reverse();

  return new ImageResponse(
    (
      <div
        tw="bg-white w-full h-full flex flex-col items-center justify-center"
      >
        <h1 tw="font-bold text-3xl">{ title }</h1>
        <div
          tw="
            border-2
            border-gray-300
            w-11/12
            h-10/12
            flex
          "
        >
          <div
            tw="
              w-2/12
              h-full
              border-r
              border-gray-300
              flex
              flex-col
              justify-start
              items-center
            "
          >
            { bucketLabels }
          </div>
          <div
            tw="
              w-5/12
              h-full
              border-l
              border-r
              border-gray-300
              flex
              flex-col
              justify-start
              items-end
            "
          >
            { maleBuckets }
          </div>
          <div
            tw="
              w-5/12
              h-full
              border-l
              border-gray-300
              flex
              flex-col
              justify-start
              items-start
            "
          >
            { femaleBuckets }
          </div>
        </div>
        <p tw="absolute right-0 bottom-0 m-4 text-lg text-gray-400">
          # Non-Binary Members: { NonBinary.reduce((total, num) => total + num, 0) }
        </p>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    },
  );
}

export const config = {
  runtime: 'experimental-edge',
  caches: {
    edge: {
      maxAgeSeconds: 0, // Don't cache
    }
  }
  
}
