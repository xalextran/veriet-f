"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import type { OrganizationCustomRoleKey, OrganizationMembershipResource } from "@clerk/types";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import React from "react";
import { TeamMembersTableSkeleton } from "./team-members-table-skeleton";

export const OrgMembersParams = {
  memberships: {
    pageSize: 20,
    keepPreviousData: true,
  },
};

export function TeamMembersSection() {
  const { user } = useUser();
  const { organization, isLoaded, memberships } = useOrganization(OrgMembersParams);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
  const initialLoad = useRef(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Load organization data when organization changes (following design system pattern)
  useEffect(() => {
    if (organization?.id) {
      setLoading(true);
      setRolesLoading(true);
      // Reset state for new organization
      setMembers([]);
      isPopulated.current = false;
      initialLoad.current = true;
    }
  }, [organization?.id]);

  useEffect(() => {
    if (isPopulated.current) return;
    if (!organization) return;
    
    setRolesLoading(true);
    organization.getRoles({ pageSize: 20, initialPage: 1 }).then((res) => {
      isPopulated.current = true;
      setRoles(res.data.map((role) => role.key as OrganizationCustomRoleKey));
      setRolesLoading(false);
    });
  }, [organization]);

  // Team members fetch effect
  useEffect(() => {
    if (!isLoaded || !memberships) return;
    setLoading(true);
    if (Array.isArray(memberships.data)) {
      setMembers(memberships.data);
      if (initialLoad.current) initialLoad.current = false;
    }
    setLoading(false);
  }, [isLoaded, memberships]);

  const handleInvite = async () => {
    if (!organization) return;
    setInviting(true);
    try {
      await organization.inviteMember({ emailAddress: inviteEmail, role: inviteRole });
      toast.success("Invitation sent!");
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (err) {
      console.error("Invite error:", err);
      toast.error("Failed to send invite.");
    }
    setInviting(false);
  };

  // Progressive skeleton loading - only skeleton the table content
  const showTableSkeleton = !isLoaded || (loading && initialLoad.current) || rolesLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Team members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={showTableSkeleton}>
              <Upload className="h-4 w-4" />
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite member</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to invite and select their role.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
            />
            <SelectRole
              onChange={setInviteRole}
              defaultRole="member"
              roles={fetchedRoles}
              rolesLoading={rolesLoading}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={inviting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  "Send invite"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {showTableSkeleton ? (
          <TeamMembersTableSkeleton />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length > 0 ? (
                  members.map((mem: OrganizationMembershipResource) => (
                    <TableRow key={mem.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {mem.publicUserData?.imageUrl ? (
                            <AvatarImage src={mem.publicUserData.imageUrl} alt={mem.publicUserData?.identifier || "User"} />
                          ) : (
                            <AvatarFallback>{mem.publicUserData?.identifier?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{mem.publicUserData?.firstName || mem.publicUserData?.identifier || "User"} {mem.publicUserData?.userId === user?.id && "(You)"}</div>
                          <div className="text-muted-foreground text-sm">{mem.publicUserData?.identifier || ""}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SelectRole
                          defaultRole={mem.role}
                          onChange={async (newRole) => {
                            await mem.update({ role: newRole as OrganizationCustomRoleKey });
                            await memberships?.revalidate?.();
                          }}
                          roles={fetchedRoles}
                          rolesLoading={rolesLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={!mem.publicUserData ? "secondary" : "default"}>
                          {!mem.publicUserData ? "Pending" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{mem.createdAt ? new Date(mem.createdAt).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={async () => { await mem.destroy(); await memberships?.revalidate?.(); }}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No team members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SelectRole({ isDisabled = false, onChange, defaultRole, roles, rolesLoading }: {
  isDisabled?: boolean;
  onChange?: (role: string) => void;
  defaultRole?: string;
  roles: OrganizationCustomRoleKey[];
  rolesLoading: boolean;
}) {
  // Use local state to control the value for shadcn Select
  const [value, setValue] = React.useState(defaultRole || "");
  React.useEffect(() => {
    setValue(defaultRole || "");
  }, [defaultRole]);

  return (
    <Select
      value={value}
      onValueChange={async (val) => {
        setValue(val);
        if (onChange) {
          onChange(val);
        }
      }}
      disabled={isDisabled || rolesLoading}
    >
      <SelectTrigger className="w-[120px]" size="sm">
        <SelectValue placeholder={rolesLoading ? "Loading..." : "Select role"} />
      </SelectTrigger>
      <SelectContent>
        {rolesLoading ? (
          <SelectItem value="" disabled>Loading...</SelectItem>
        ) : (
          roles.map((roleKey) => (
            <SelectItem key={roleKey} value={roleKey}>
              {roleKey}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
