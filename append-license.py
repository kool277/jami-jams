import os

dir_name = "/Users/felixsidokhine/Git/jams-refactoring" # Edit as needed


for parent, dirnames, filenames in os.walk(dir_name):
    for fn in filenames:
        if(".java" in fn):
            print("Found Java Source Code File!")
            with open(os.path.join(parent, fn), 'r') as f:
                lines = f.readlines() #read
                if "/*" in lines[0]:
                    continue
                else:
                    lines.insert(0,"*/\n")
                    lines.insert(0,"* along with this program.  If not, see <https://www.gnu.org/licenses/>.\n")
                    lines.insert(0,"* You should have received a copy of the GNU General Public License\n")
                    lines.insert(0,"*\n")
                    lines.insert(0,"* GNU General Public License for more details.\n")
                    lines.insert(0,"* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n")
                    lines.insert(0,"* but WITHOUT ANY WARRANTY; without even the implied warranty of\n")
                    lines.insert(0,"* This program is distributed in the hope that it will be useful,\n")
                    lines.insert(0,"*\n")
                    lines.insert(0,"* (at your option) any later version.\n")
                    lines.insert(0,"* the Free Software Foundation; either version 3 of the License, or\n")
                    lines.insert(0,"* it under the terms of the GNU General Public License as published by\n")
                    lines.insert(0,"* This program is free software; you can redistribute it and/or modify\n")
                    lines.insert(0,"*\n")
                    lines.insert(0,"*\n")
                    lines.insert(0,"*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>\n")
                    lines.insert(0,"*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>\n")
                    lines.insert(0,"*          Johnny Flores <johnny.flores@savoirfairelinux.com>\n")
                    lines.insert(0,"*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>\n")
                    lines.insert(0,"* Authors: William Enright <william.enright@savoirfairelinux.com>\n")
                    lines.insert(0,"* Copyright (C) 2020 by Savoir-faire Linux\n")
                    lines.insert(0,"/*\n")
            with open(os.path.join(parent, fn), 'w') as f:
                f.writelines(lines) #write back