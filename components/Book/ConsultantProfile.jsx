"use client";
export default function ConsultantProfile({ data }) {
  return (
    <div className="p-6">
      <h2>{data.consultantId.firstName} {data.consultantId.lastName}</h2>
      <p>{data.bio}</p>
    </div>
  );
}