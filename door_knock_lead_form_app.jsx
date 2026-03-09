import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";

export default function DoorKnockLeadFormApp() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    turnover: "",
    fundingNeed: "",
    notes: "",
    followUpDate: "",
  });

  const [leads, setLeads] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.businessName || !form.phone) return;
    setLeads([...leads, { ...form, id: Date.now() }]);
    setForm({
      businessName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      turnover: "",
      fundingNeed: "",
      notes: "",
      followUpDate: "",
    });
  };

  const deleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const exportToCSV = () => {
    const headers = Object.keys(form);
    const rows = leads.map((lead) =>
      headers.map((header) => `"${lead[header] || ""}"`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "door_knock_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Door Knocking Lead Form
      </motion.h1>

      <Card className="rounded-2xl shadow-md mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="businessName" placeholder="Business Name *" value={form.businessName} onChange={handleChange} required />
            <Input name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input name="address" placeholder="Business Address" value={form.address} onChange={handleChange} />
            <Input name="turnover" placeholder="Estimated Annual Turnover" value={form.turnover} onChange={handleChange} />
            <Input name="fundingNeed" placeholder="Funding Requirement (£)" value={form.fundingNeed} onChange={handleChange} />
            <Input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} />
            <Textarea
              name="notes"
              placeholder="Notes (Pain points, objections, timeline, etc.)"
              value={form.notes}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <Button type="submit" className="md:col-span-2 rounded-2xl">
              Save Lead
            </Button>
          </form>
        </CardContent>
      </Card>

      {leads.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saved Leads</h2>
              <Button onClick={exportToCSV} className="rounded-2xl flex items-center gap-2">
                <Download size={16} /> Export CSV
              </Button>
            </div>

            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 bg-white rounded-2xl shadow-sm border flex justify-between">
                  <div>
                    <p className="font-semibold">{lead.businessName}</p>
                    <p className="text-sm">{lead.contactName} | {lead.phone}</p>
                    <p className="text-sm text-gray-600">Funding: £{lead.fundingNeed}</p>
                    <p className="text-sm text-gray-500">Follow Up: {lead.followUpDate}</p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => deleteLead(lead.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
